project(zap-java)

cmake_minimum_required(VERSION 3.9)

find_package(PkgConfig REQUIRED)

set(CMAKE_CXX_STANDARD 14)
set(ZAPC_JAVA_SOURCES ../compiler/src/main/cpp/zapc-java.c++)

if(ZAP_PKG_PATH)
  set(ENV{PKG_CONFIG_PATH} "$ENV{PKG_CONFIG_PATH}:${ZAP_PKG_PATH}")
else()
  find_path(ZAP_PKG_PATH_VAR "zap/lib/pkgconfig" HINTS ${ZAP_PKG_PATH})
  set(ENV{PKG_CONFIG_PATH} "$ENV{PKG_CONFIG_PATH}:${ZAP_PKG_PATH_VAR}")
endif()

pkg_search_module(PKG_ZAP REQUIRED zap)

if(PKG_ZAP_FOUND)
  message(STATUS "Zap found!")
  add_executable(zapc-java
    ${ZAPC_JAVA_SOURCES}
  )

  target_include_directories(zapc-java
    PRIVATE
      ${PKG_ZAP_INCLUDE_DIRS}
  )

  target_link_libraries(zapc-java
    ${PKG_ZAP_LDFLAGS}
  )
else()
  message(FATAL_ERROR "Zap not found!")
endif()
