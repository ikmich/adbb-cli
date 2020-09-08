`adbb` provides a little boost to the Android ADB command set to make your Android development work easier!

## Usage on Windows OS
* Shell commands specific to Windows OS are **not currently implemented**. Support for Windows OS is planned for a future release.

## Installation  
#### npm  
```
npm install -g adbb
```  

#### yarn  
```
yarn add --global adbb
```

## Commands

### `devices`  
`$ adbb devices`  
List connected devices  

**Options**  
* `-v`, `--verbose`  
  Display a bit of extra information  
* `-j`, `--json`  
  Display devices information in json format. Implies the `-v` option.  
* `-g`, `--grid`  
  Display devices information in tabular format. Implies the `-v` option.  

**Example**
```
adbb devices -v
adbb devices -j
adbb devices -g
```  

### `wifi`  
`$ adbb wifi`  
Connect a device for debugging via Wi-Fi connection.  

**Options**  
* `-x` | `--disconnect`  
  Disconnect the device from the Wi-Fi connection.  

### `pkgs` | `packages`  
List application packages installed on the device.  

**Options**  
* `-f`, `--filter`  
  Applies filter to return packages that contain the specified string.  

**Example**  
```
adbb pkgs -f org.app
```  
You can also filter using the more convenient filter directive, `:`, as a prefix just before the filter string.  
**Example**  
```
adbb pkgs :org.app
```

### `emu` | `emulator`  
Launch an emulator. You are prompted with the list of available emulators to select from.  

**Options**  
* `-l`, `--list`  
  List the available emulators without launching any.  

### `package` | `pkg`  
Specify the reference package name to use while using `adbb` to avoid having to type the package name every time.  

**Options**  
* `--unset`  
  Deletes a previously set reference package.  
  
**Example**  
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

**Arguments**  
* `package` | `pkg`  
  The package name of the application whose data is to be cleared.  

**Options**  
* `--package`, `--pkg`  
  The package name of the application whose data is to be cleared. This option can be used to specify the package if the **package** argument is not passed.  

**Example**  
    adbb clear org.app.package  

**Applying a filter**  
Using the `clear` command with a filter, you are shown a list of packages to choose from, to apply the `clear` command to.  
```
adbb clear -f org.app.pack
```
**Usage with the filter directive**  
You can use the more convenient `:` filter directive to apply a filter to the `clear` command:  
```
adbb clear :org.app.pa
```

### `ip`  
Get the device IP address(es).  

### `reset-server`  
Kill and restart the adb server.  

### `uninstall [package]`  
Uninstalls the application with the specified package argument. If you don't provide a package argument, you will be prompted to 
enter the intended application package. If a reference package has been set (via `adbb pkg <package>`), user will be 
asked if they want to continue with that package.  

**Applying a filter**  
Using the `uninstall` command together with a filter, you are shown a list of packages to choose from, to apply the 
`uninstall` command to.  
```
adbb uninstall -f org.app.pack
```

**Usage with the filter directive**  
You can use the more convenient `:` filter directive to apply a filter to the `uninstall` command:  
```
adbb uninstall :org.app.pa
```

### `ping`  
Pings the device's IP address. You can run this command to check that the device can be reached over the network 
for a tcp connection.  

### `screenshot` | `shot`  
Take a screenshot of the device's currently active screen. The image file will be saved in the current directory from
which this command is run.  
**Example**  
```
adbb screenshot
```