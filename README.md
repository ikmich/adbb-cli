## Usage on Windows OS
* Shell commands specific to Windows OS are **not currently implemented**. Support for Windows OS is planned for a future release.

## Installation  
#### npm  
```
npm install -g adbb  (Not working yet)
```  

#### yarn  
```
yarn add --global adbb  (Not working yet)  
```

## Commands

### `devices`  
`$ adbb devices`  
List connected devices  

##### **Options**  
* `-v`, `--verbose`  
  Display a bit of extra information  
* `-j`, `--json`  
  Display devices information in json format. Implies the `-v` option.  
* `-g`, `--grid`  
  Display devices information in tabular format. Implies the `-v` option.  

##### **Example**
```
adbb devices -v
adbb devices -j
adbb devices -g
```  

### `wifi`  
`$ adbb wifi`  
Connect a device for debugging via Wi-Fi connection.  

##### **Options**
* `-x`, `--disconnect`  
  Disconnect the device from the Wi-Fi connection.  

### `pkgs` | `packages`  
List application packages installed on the device.  

##### **Options**  
* `-f`, `--filter`  
  Applies filter to return packages that contain the specified string.  

**Example**  
```
adbb pkgs -f org.app
```  
You can also filter using the filter directive, `:`, as a prefix just before the filter string.  
**Example**  
```
adbb pkgs :org.app
```

### `emu` | `emulator`  
Launch an emulator. You are prompted with the list of available emulators to select from.  

##### **Options**  
* `-l`, `--list`  
  List the available emulators without launching any.  

### `package` | `pkg`  
Specify the reference package name to use while using `adbb` to avoid having to type the package name every time.  

##### **Options**  
* `--unset`  
  Deletes a previously set reference package.  
  
##### **Example**  
```
adbb pkg org.app.package  
adbb pkg --unset
```

### `unset-package` | `unset-pkg`  
Deletes a previously set reference package name.  

##### Example  
```
adbb unset-pkg
```

### `clear <package>`
Clear application data for specified package. If no package is specified, you will be prompted to input the intended application package.  

##### **Arguments**  
* `package` | `pkg`  
  The package name of the application whose data is to be cleared.  

##### **Options**  
* `--package`, `--pkg`  
  The package name of the application whose data is to be cleared. This option can be used to specify the package if the **package** argument is not passed.  

##### Example  
    adbb clear org.app.package  

### `ip`  
Get the device IP address(es).  

### `reset-server`  
Kill and restart the adb server.  

### `uninstall [package]`  
Uninstalls the application with the specified package argument. If no package argument is provided, user is asked to 
enter the intended application package. If a reference package has been set (via `adbb pkg <package>`), user will be 
asked if they want to continue with that package.  

### `ping`  
Pings the device's IP address. You can run this command to check that the device can be reached over the network 
for a tcp connection.  

