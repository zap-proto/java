# zap-java cmake build

Of course, zap needs to be pre-installed somewhere.

## Using cmake

mkdir build
cd build
cmake -DZAP_PKG_PATH=[path of Zap pkgconfig directory (with zap.pc)] [path of CMakeLists.txt]

## Using ccmake gui

mkdir build
cd build
ccmake [path of CMakeLists.txt]
.. set pkgconfig path manually
