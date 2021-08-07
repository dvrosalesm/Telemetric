import AsyncStorage from '@react-native-community/async-storage'
import { zip, unzip, unzipAssets, subscribe } from 'react-native-zip-archive'

import { BASE_URL } from './constants'
import { GET_DOWNLOADABLE_APPS, GET_LOCAL_APPS, DELETE_APP, UPDATE_APP, REGISTER_STATS, ON_ERROR } from './types'
import {AlertMessage, MultipleOptionAlert} from '../components/Helpers/Alert';

const DOWNLOADBLE_APPS_URL = BASE_URL + '/user/apps'
const REGISTER_STATS_URL = BASE_URL + '/app/collect'
var RNFS = require('react-native-fs')

export const getDownlodableApps = () => dispatch => {
    AsyncStorage.getItem('USERTOKEN')
    .then((token) => {
        AsyncStorage.getItem('LOCALAPPS')
        .then((LocalApps) => {
            LocalApps = JSON.parse(LocalApps) || {};
            fetch(DOWNLOADBLE_APPS_URL, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Authorization': 'Bearer ' + token
                }
            }).then((responseJson) => responseJson.json())
            .then((userApps) => {
                const appsMapped = userApps.data.map((v) => {
                    if(!LocalApps.hasOwnProperty(v.name)) {
                        v.isLocal = false;
                        LocalApps[v.name] = v;
                    }
                });
                LocalApps = sortObject(LocalApps);
                Promise.all(appsMapped).then(() => {
                    dispatch({
                        type: GET_DOWNLOADABLE_APPS,
                        payload: LocalApps
                    })
                });
            })
            .catch((err) => {
                dispatch(catchExceptionAndMap(err))
                dispatch({
                    type: GET_DOWNLOADABLE_APPS,
                    payload: LocalApps
                });
            })  
        })
        .catch((err) => {dispatch(catchExceptionAndMap(err))})
    })
    .catch((err) => {dispatch(catchExceptionAndMap(err))})
} 

export const downloadAppFiles = (app, success, fail) => dispatch =>  {
    let destination = RNFS.DocumentDirectoryPath + "/apps";
    dispatch(updateDownloadStatus(null, app));
    RNFS.exists(destination).then(res => {
        if(!res) {
            RNFS.mkdir(destination, {
                NSURLIsExcludedFromBackupKey: true
            }).then(() => {
                debugger;
                downloadAppFilesHelper(destination, app, success, fail, dispatch);
            });
        } else {
            downloadAppFilesHelper(destination, app, success, fail, dispatch);
        }
    });
}   

export const updateAppAction = (app) => dispatch => {
    dispatch({type: UPDATE_APP, payload: app});
}

export const getLocalApps = () => dispatch => {
    AsyncStorage.getItem('LOCALAPPS')
    .then((LocalApps) => {
        dispatch({
            type: GET_LOCAL_APPS,
            payload: JSON.parse(LocalApps)
        })
    })
    .catch((err) => {
         dispatch({
             type: GET_DOWNLOADABLE_APPS,
             payload: {
                type: GET_LOCAL_APPS,
                response: err,
                loaded: true
             }
         })
    })
}

export const deleteApp = (app, cb) => dispatch => {
    let destination = app.destination || RNFS.DocumentDirectoryPath + "/apps/" + app.name;
    deleteLocalFolder(destination, (LocalApps) => {
        deleteLocalFolder(destination + '.zip', async (LocalApps) => {
            delete LocalApps[app.name];
            await AsyncStorage.setItem('LOCALAPPS', JSON.stringify(LocalApps));
            cb();
            dispatch(getDownlodableApps());
        }, dispatch);
    }, dispatch);
}

export const cancelAppDownload = (app, cb) => dispatch => {
    if(app.jobId) {
        RNFS.stopDownload(app.jobId);
    }

    let destination = app.destination || RNFS.DocumentDirectoryPath + "/apps/" + app.name;
    deleteLocalFolder(destination, (LocalApps) => {
        deleteLocalFolder(destination + '.zip', async (LocalApps) => {
            delete LocalApps[app.name];
            await AsyncStorage.setItem('LOCALAPPS', JSON.stringify(LocalApps));
            cb();
            dispatch({
                type: DELETE_APP,
                payload: LocalApps
            });
            dispatch(getDownlodableApps());

        }, dispatch);
    }, dispatch);
}

export const deleteAllApps = (cb) => dispatch => { 
    let destination = RNFS.DocumentDirectoryPath + "/apps";
    deleteLocalFolder(destination, async () => {
        await AsyncStorage.clear();
        cb();
    }, dispatch);
}


export const registerData = (data, cb) => dispatch => {

    AsyncStorage.getItem('USERTOKEN')
    .then((token) => {
        AsyncStorage.getItem('APPDATA')
        .then( (userData) => {
            userData = (userData != null) ? JSON.parse(userData) : [];
            userData.push(data.data);
            fetch(REGISTER_STATS_URL, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({data: userData})
            }).then((responseJson) => responseJson.json())
            .then((userApps) => {
                //AlertMessage("desde final de request 2222", userApps, () => {});
                if(userApps.exception && userApps.exception !== "") {
                    dispatch(catchExceptionAndMap(userApps.exception))
                    AsyncStorage.setItem('APPDATA', JSON.stringify(userData));
                } else {
                    dispatch({type: REGISTER_STATS})
                    cb(userApps);
                    AsyncStorage.removeItem('APPDATA');
                }
            })
            .catch((err) => {
                dispatch(catchExceptionAndMap(err))
                AsyncStorage.setItem('APPDATA', JSON.stringify(userData));
            }) 
        });
    })
    .catch((err) => {
        dispatch(catchExceptionAndMap(err))
    });
    
}

/* ACTION UTILITIES */


const deleteLocalFolder = (destination, callback, dispatch) => {
    AsyncStorage.getItem('LOCALAPPS')
    .then((LocalApps) => {
        LocalApps = JSON.parse(LocalApps) || {};
        RNFS.exists(destination)
        .then(async (res) => {
            if(!res) {
                callback(LocalApps);
            } else {
                RNFS.unlink(destination)
                .then(res => {
                    callback(LocalApps);
                })
                .catch(err => {
                    dispatch({
                        type: ON_ERROR,
                        payload: err
                    });
                });
            }
        })
        .catch((err) => {
            dispatch({
                type: ON_ERROR,
                payload: err
            });
        });
        
    })
    .catch((err) => {
         dispatch({
             type: ON_ERROR,
             payload: {
                response: err,
                loaded: true
             }
         })
    })
}

const updateDownloadStatus = (res, app) => dispatch => {
    if(res && res.jobId)
        app.jobId = res.jobId;
    app.finishedDownload = false;
    updateLocalApp(app);
    dispatch({type: UPDATE_APP, payload: app});
}

const unzipApp = (app) => {
    app.indexPath = RNFS.DocumentDirectoryPath + "/apps/" + app.name;
    RNFS.mkdir(app.indexPath, {
        NSURLIsExcludedFromBackupKey: true
    });
    unzip(app.destination, app.indexPath)
    .then(() => {
        app.indexPath = app.indexPath + "/index.html"
        updateLocalApp(app)
    })
    .catch(err => {
        console.log(err);
    })
}

const updateLocalApp = (app) => {
    AsyncStorage.getItem('LOCALAPPS')
    .then((data) => {
        let localapps = JSON.parse(data);
        if(localapps == null)
            localapps = {}
        app.isLocal = true;
        localapps[app.name] = app;
        let savedLocalApps = JSON.stringify(localapps);
        AsyncStorage.setItem('LOCALAPPS', savedLocalApps);
    })
    .catch((err)=> {
        console.log(err)
    })
}

const catchExceptionAndMap = (err) => {
    console.log(err);
    return {type: ON_ERROR, payload: {response: err}};
}

const sortObject = (src) => {
    var out;
    if (typeof src === 'object' && Object.keys(src).length > 0) {
      out = {};
      Object.keys(src).sort().forEach(function (key) {
        out[key] = sortObject(src[key]);
      });
      return out;
    }
    return src;
}

const downloadAppFilesHelper = (destination, app, success, fail, dispatch) => {
    destination = destination + "/" + app.name + ".zip";
    RNFS.downloadFile({
        fromUrl: app.zip,
        toFile: destination,
        background: true,
        begin: (res) => dispatch(updateDownloadStatus(res, app))
    }).promise.then(res => {    
        console.log('desde que finaliza download ', res);
        let finishedApp = JSON.parse(JSON.stringify(app));
        finishedApp.destination = destination;
        finishedApp.finishedDownload = true
        updateLocalApp(finishedApp);
        unzipApp(finishedApp);
        dispatch(updateAppAction(finishedApp));
        success();
    }).catch(res => {
        console.log("finalizo con error?: ", res);
        fail();
    });
} 