PKG_CONFIG ?= pkg-config
ZAP_CXX_FLAGS=$(shell $(PKG_CONFIG) zap --cflags --libs)

ifeq ($(ZAP_CXX_FLAGS),)
$(warning "Warning: pkg-config failed to find compilation configuration for zap.")
$(warning "Falling back to a guess based on the location of the zap executable.")
ZAP_PREFIX=$(shell dirname $(shell which zap))/..
ZAP_CXX_FLAGS=-I $(ZAP_PREFIX)/include -L $(ZAP_PREFIX)/lib -lkj -lzap
endif

PREFIX ?= /usr/local

CXX ?= g++
CXX_FLAGS=-std=c++14 $(ZAP_CXX_FLAGS)

ZAPC_JAVA_SOURCES=compiler/src/main/cpp/zapc-java.c++

.PHONY: all clean

all : zapc-java

clean :
	rm -f zapc-java zapc-java.exe

zapc-java : $(ZAPC_JAVA_SOURCES)
	$(CXX) $(ZAPC_JAVA_SOURCES) $(CXX_FLAGS) $(CFLAGS) $(LDFLAGS) -o zapc-java

install:
	mkdir -p ${PREFIX}/bin
	mkdir -p ${PREFIX}/include/zap/
	cp zapc-java ${PREFIX}/bin
	cp compiler/src/main/schema/zap/java.zap ${PREFIX}/include/zap/

MINGW_LIBS=~/src/zap/c++/build-mingw/.libs/libzap.a ~/src/zap/c++/build-mingw/.libs/libkj.a
MINGW_CXX=i686-w64-mingw32-g++
MINGW_FLAGS=-O2 -DNDEBUG -I/usr/local/include -std=c++14 -static -static-libgcc -static-libstdc++
zapc-java.exe : $(ZAPC_JAVA_SOURCES)
	$(MINGW_CXX) $(MINGW_FLAGS) $(ZAPC_JAVA_SOURCES) $(MINGW_LIBS) -o zapc-java.exe
