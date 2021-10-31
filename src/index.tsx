import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { CallClient } from '@azure/communication-calling';

const LOCAL_STORAGE_DEVICE_INFO_KEY = 'preferredDeviceInfo'

export type PreferredDeviceInfo = {
  microphone?: string;
  speaker?: string;
  camera?: string;
}

const getDevicesFromLocalStorage = (): PreferredDeviceInfo | undefined=> {
  const preferredDevices = localStorage.getItem(LOCAL_STORAGE_DEVICE_INFO_KEY);

  if(!preferredDevices) {
    return;;

  }
  return JSON.parse(preferredDevices);
}

const saveDevicesToLocalStorage = (devices: PreferredDeviceInfo) => {
  localStorage.setItem(LOCAL_STORAGE_DEVICE_INFO_KEY, JSON.stringify(devices));
}

const run = async () => {
  const callClient = new CallClient();
  const deviceManager = await callClient.getDeviceManager();
  const speakersFromDeviceManager = await deviceManager.getSpeakers();
  const microphonesFromDeviceManager = await deviceManager.getSpeakers();
  const camerasFromDeviceManager = await deviceManager.getCameras();

  let preferredDeviceInfo = getDevicesFromLocalStorage();

  if (preferredDeviceInfo) {
    console.log('devices loaded from LS '+JSON.stringify(preferredDeviceInfo))
  }
  else {
    preferredDeviceInfo = {
      camera: camerasFromDeviceManager[0].id,
      speaker: speakersFromDeviceManager.filter(speaker => speaker.isSystemDefault)[0].id,
      microphone: microphonesFromDeviceManager.filter(microphone => microphone.isSystemDefault)[0].id
    }
    saveDevicesToLocalStorage(preferredDeviceInfo)
  }

  ReactDOM.render(
    <React.StrictMode>
      <App speakers={speakersFromDeviceManager}
          microphones={microphonesFromDeviceManager}
          cameras={camerasFromDeviceManager}
          saveDevicesToLocalStorage={saveDevicesToLocalStorage}
          preferredDevices={preferredDeviceInfo}
      />
    </React.StrictMode>,
    document.getElementById('root')
  );
}

run();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
