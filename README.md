`adbb` provides a little boost to the Android ADB command set to make your Android development work easier!

## Usage on Windows OS

- Shell commands specific to Windows OS are not currently implemented. Full support for Windows OS is planned for a
  future release.

## Installation

#### Install with npm

```shell script
npm install -g adbb
```

#### Install with yarn

```shell script
yarn global add adbb
```

## Command summary

```
adbb [command]

Commands:
  adbb devices                List connected devices
  adbb packages               List installed packages
  adbb wifi                   Connect the device via wifi
  adbb clear                  Clear data for application
  adbb emulator               Start an emulator. Shows available emulators for u
                              ser to select
  adbb ip                     Show the device IP address(es)
  adbb restart                Reset adb server
  adbb screenshot             Take screenshot of the device screen
  adbb path                   Get path of installed application package
  adbb ping                   Ping the device ip address to check the wifi conne
                              ction
  adbb unset-default-package  Unset currently set default reference package
  adbb set-default-package    Set default reference package for commands
  adbb restart                Reset the adb connection
  adbb uninstall              Uninstall an application
  adbb screenrecord           Record the screen for maximum of 3 minutes

Options:
      --version          Show version number                           [boolean]
      --verbose          Long output                                   [boolean]
  -f, --filter           Filter to apply to command output              [string]
      --wifi             Connect adb via wifi                          [boolean]
  -x, --disconnect       Disconnect device connected via tcpip (wifi)  [boolean]
  -s, --sid, --serialId  Device serial id                               [string]
      --package, --pkg   Set the target application package             [string]
      --unset            Unset a value                                 [boolean]
  -l, --list             Display items                                 [boolean]
      --open             Open file or resource                         [boolean]
      --get                                                            [boolean]
      --getAll                                                         [boolean]
      --purge                                                          [boolean]
      --help             Show help                                     [boolean]
```

## Commands

#### `devices`

List connected devices

```shell script
adbb devices

# Running `adbb` alone also lists connected devices.
adbb

# Display extra information
adbb devices -v

# Display devices info in json format. Implies the `-v` option
adbb devices -j

# Display devices info in a tabular format. Implies the `-v` option
adbb devices -g
```

#### `wifi`

Connect a device for debugging via Wi-Fi connection.

```shell script
adbb wifi
```

**Options**

- `-x` | `--disconnect`  
  Disconnect the device from the Wi-Fi connection.

#### `pkgs` | `packages`

List application packages installed on the device.

**Options**

- `-f` | `--filter`  
  Applies filter to return packages that contain the specified string.

```shell script
adbb pkgs -f org.app
```

You can also filter using the more convenient filter directive, `:`, as a prefix just before the filter string.  
**Example**

```shell script
adbb pkgs :org.app
```

#### `emu` | `emulator`

Run `adbb emu` without any options to launch an emulator. You are prompted with the list of available emulators to
select from.

**Options**

- `-l` | `--list`  
  List the available emulators without launching any.

#### `set-default-package` | `set-default-pkg`

Specify the reference package name to use while using `adbb` to avoid having to type the package name every time.

**Options**

- `--unset`  
  Passing this option deletes a previously set reference package.

**Example**

```shell script
# Set
adbb set-pkg org.app.cool_app
adbb set-pkg --unset
```

#### `unset-default-package` | `unset-default-pkg`

Deletes a previously set reference package name.

##### Example

```shell script
adbb unset-pkg
```

#### `clear <package>`

Clear application data for specified package. If no package is specified, you will be prompted to input the intended
application package.

**Options**

- `--package` | `--pkg`  
  The package name of the application whose data is to be cleared. This option can be used to specify the package if
  the **package** argument is not passed.

**Example**

```shell script
adbb clear org.app.cool_app
```

**Applying a filter**  
Using the `clear` command with a filter, you are shown a list of packages to choose from, to apply the `clear` command
to.

```shell script
# Apply filter
adbb clear -f cool_

# Apply filter using the ':' filter directive
adbb clear :cool_
```

#### `ip`

Get the device IP address(es).

#### `restart`

Kill and restart the adb server. It's recommended to run this with the device connected via USB.

#### `uninstall <package>`

Uninstalls the application with the specified package argument. If you don't provide a package argument, you will be
prompted to enter the intended application package. If a reference package has been set (via `adbb pkg <package>`), user
will be asked if they want to continue with that package.

**Applying a filter**  
Using the `uninstall` command together with a filter, you are shown a list of packages (that match the filter string)
to choose from, to apply the `uninstall` command to.

```shell script
adbb uninstall -f org.app.pack

# Or use with the more convenient ':' filter directive
adbb uninstall :org.app.pack
```

#### `ping`

Pings the device's IP address. You can run this command to check that the device can be reached over the network for a
tcp connection.

```shell script
adbb ping
```

#### `screenshot`

Take a screenshot of the device's currently active screen. The image file will be saved in the current directory from
which this command was run.

```shell script
adbb screenshot
adbb scrshot

# Open the image file after screen capture
adbb screenshot --open
```

#### `screenrec`

Take a recording of the device screen for a max of 3 minutes. The video file will be saved on the device. You can
extract the video recording files using various options of the `screenrec` command.
```shell
# Initiate recording
adbb screenrec

# Extract the latest recording from device to host computer and delete from device.
adbb screenrec pull

# Extract all the recordings from device to host computer and delete from device.
adbb screenrec pull --all

# Remove all recording files
adbb screenrec clear
adbb screenrec purge
```

#### `path <package>`

Gets the installed path for the specified application package.

```shell script
adbb path org.app.cool_app

# Get path for applications that match a filter
adbb path :cool
```

# Changelogs

## 1.0.0

- Bugfix: ScreenshotCommand logging wrong screenshot file path
- Rename command: set-package(set-pkg) -> set-default-package (set-default-pkg)
- Rename command: unset-package(unset-pkg) -> unset-default-package (unset-default-pkg)
- Discard use of moment library in favour of date-fns
