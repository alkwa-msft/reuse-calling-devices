import { useState } from 'react';
import './App.css';
import { AudioDeviceInfo, VideoDeviceInfo } from '@azure/communication-calling';
import { Dropdown, IDropdownOption, Stack } from '@fluentui/react';
import { PreferredDeviceInfo } from '.';

export type AppProps = {
  cameras: VideoDeviceInfo[],
  speakers: AudioDeviceInfo[],
  microphones: AudioDeviceInfo[],
  preferredDevices: PreferredDeviceInfo
  saveDevicesToLocalStorage: (devices: PreferredDeviceInfo) => void
}

function App(props: AppProps) {
  const { speakers, microphones, cameras, preferredDevices, saveDevicesToLocalStorage } = props;
  const [preferredDevicesInternal, setPreferredDevicesInternal] = useState(preferredDevices);
  
  const speakerOptions: IDropdownOption[] = speakers.map(speaker => { return { key: speaker.id, text: speaker.name}});
  const microphoneOptions: IDropdownOption[] = microphones.map(microphone => { return { key: microphone.id, text: microphone.name}});
  const cameraOptions: IDropdownOption[] = cameras.map(camera => { return { key: camera.id, text: camera.name}});
  
  return (
    <div className="App">
        <Stack>
          <Dropdown
            label="Microphones"
            defaultSelectedKey={preferredDevices.microphone}
            options={microphoneOptions}
            onChange={(_, option) => {
              if (!option) {
                return;
              }
              const newPreferredMicrophone = microphones.filter(microphone => microphone.id === option.key)[0];
              preferredDevicesInternal.microphone = newPreferredMicrophone.id;
              setPreferredDevicesInternal(preferredDevicesInternal);
              saveDevicesToLocalStorage(preferredDevicesInternal);
            }}
            />
          <Dropdown
            label="Cameras"
            defaultSelectedKey={preferredDevices.camera}
            options={cameraOptions}
            onChange={(_, option) => {
              if (!option) {
                return;
              }
              const newPreferredCamera = cameras.filter(camera => camera.id === option.key)[0];
              preferredDevicesInternal.camera = newPreferredCamera.id;
              setPreferredDevicesInternal(preferredDevicesInternal);
              saveDevicesToLocalStorage(preferredDevicesInternal);
            }}
            />
          <Dropdown
            label="Speakers"
            defaultSelectedKey={preferredDevices.speaker}
            options={speakerOptions}
            onChange={(_, option) => {
              if (!option) {
                return;
              }
              const newPreferredSpeaker = speakers.filter(speaker => speaker.id === option.key)[0];
              preferredDevicesInternal.speaker = newPreferredSpeaker.id;
              setPreferredDevicesInternal(preferredDevicesInternal);
              saveDevicesToLocalStorage(preferredDevicesInternal);
            }}
            />
        </Stack>
    </div>
  );
}

export default App;
