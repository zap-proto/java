---
layout: page
title: ZAP for Java
---

## Introduction

This is a Java implementation of [ZAP](https://zap-proto.io).
It has two main components:

1. A C++ program `zapc-java` that
generates Java source code from ZAP [schemas](https://zap-proto.io/language.html)
by acting as a
[plugin](https://zap-proto.io/otherlang.html#how-to-write-compiler-plugins)
to the ZAP schema compiler.

2. A Java package `org.zap` that provides runtime support for `zapc-java`'s generated code.

These components let you make your data **mobile**,
so that you can manipulate your data in Java
and also easily communicate it
to distributed components written
in other programming languages.
Under the hood, all operations are
backed by `java.nio.ByteBuffer`.
If you, for example, want to communicate over a
network, you can just directly write the bytes to the wire.
There is no encode or decode step!

We hope eventually to provide support in Java for a
[distributed object-capability layer](https://zap-proto.io/rpc.html)
built on top of this serialization layer,
but we have not embarked on that project yet.


## Installation

### Schema Compiler and Plugin

You will need to [install](https://zap-proto.io/install.html) the
latest release of the ZAP schema compiler.
Then, running `make` in the root directory of the zap-java repository
should build `zapc-java`.


For help on how to invoke the schema compiler:

```
zap compile --help
```

Note that you'll need to include `java.zap` so that you can use the `package` and `outerClassname`
annotations. This schema is located in `compiler/src/main/schema`.

You might find useful [this Maven Plugin](https://github.com/expretio/zap-maven-plugin).

### Runtime

The runtime is available on
[The Central Repository](https://search.maven.org/#search%7Cga%7C1%7Cg%3A%22org.zap%22).

We use [maven](https://maven.apache.org/) for building and testing the Java code.
Running `mvn compile` at the top-level directory should build
`org.zap` and `org.zap.examples`.
Running `mvn test` should run the test suite.

## Example

We can define types in a schema like this:

{% highlight zap %}
@0x9eb32e19f86ee174;
using Java = import "/zap/java.zap";
$Java.package("org.zap.examples");
$Java.outerClassname("Addressbook");

struct Person {
  id @0 :UInt32;
  name @1 :Text;
  email @2 :Text;
  phones @3 :List(PhoneNumber);

  struct PhoneNumber {
    number @0 :Text;
    type @1 :Type;

    enum Type {
      mobile @0;
      home @1;
      work @2;
    }
  }

  employment :union {
    unemployed @4 :Void;
    employer @5 :Text;
    school @6 :Text;
    selfEmployed @7 :Void;
    # We assume that a person is only one of these.
  }
}

struct AddressBook {
  people @0 :List(Person);
}
{% endhighlight %}

Then, after running the schema compiler,
we can then use those types from Java like this:
{% highlight java %}
package org.zap.examples;

import org.zap.StructList;
import org.zap.examples.Addressbook.AddressBook;
import org.zap.examples.Addressbook.Person;

public class AddressbookMain {

  public static void writeAddressBook() throws java.io.IOException {
    org.zap.MessageBuilder message =
      new org.zap.MessageBuilder();

    AddressBook.Builder addressbook =
      message.initRoot(AddressBook.factory);

    StructList.Builder<Person.Builder> people =
      addressbook.initPeople(2);

    Person.Builder alice = people.get(0);
    alice.setId(123);
    alice.setName("Alice");
    alice.setEmail("alice@example.com");

    StructList.Builder<Person.PhoneNumber.Builder> alicePhones =
      alice.initPhones(1);
    alicePhones.get(0).setNumber("555-1212");
    alicePhones.get(0).setType(Person.PhoneNumber.Type.MOBILE);
    alice.getEmployment().setSchool("MIT");

    Person.Builder bob = people.get(1);
    bob.setId(456);
    bob.setName("Bob");
    bob.setEmail("bob@example.com");
    StructList.Builder<Person.PhoneNumber.Builder> bobPhones =
      bob.initPhones(2);
    bobPhones.get(0).setNumber("555-4567");
    bobPhones.get(0).setType(Person.PhoneNumber.Type.HOME);
    bobPhones.get(1).setNumber("555-7654");
    bobPhones.get(1).setType(Person.PhoneNumber.Type.WORK);
    bob.getEmployment().setUnemployed(org.zap.Void.VOID);

    org.zap.SerializePacked.writeToUnbuffered(
      (new java.io.FileOutputStream(
        java.io.FileDescriptor.out)).getChannel(),
      message);
  }

  public static void printAddressBook() throws java.io.IOException {
    org.zap.MessageReader message =
      org.zap.SerializePacked.readFromUnbuffered(
        (new java.io.FileInputStream(
          java.io.FileDescriptor.in)).getChannel());

    AddressBook.Reader addressbook =
      message.getRoot(AddressBook.factory);

    for(Person.Reader person : addressbook.getPeople()) {
      System.out.println(person.getName() + ": " + person.getEmail());

      for (Person.PhoneNumber.Reader phone : person.getPhones()) {
        String typeName = "UNKNOWN";
        switch (phone.getType()) {
        case MOBILE:
          typeName = "mobile"; break;
        case HOME:
          typeName = "home"; break;
        case WORK:
          typeName = "work"; break;
        }
        System.out.println("  " + typeName + " phone: " +
                           phone.getNumber());
      }

      Person.Employment.Reader employment = person.getEmployment();
      switch (employment.which()) {
      case UNEMPLOYED:
        System.out.println("  unemployed");
        break;
      case EMPLOYER:
        System.out.println("  employer: " + employment.getEmployer());
        break;
      case SCHOOL:
        System.out.println("  student at: " + employment.getSchool());
        break;
      case SELF_EMPLOYED:
        System.out.println("  self-employed");
        break;
      default :
        break;
      }
    }
  }

  public static void usage() {
    System.out.println("usage: addressbook [write | read]");
  }

  public static void main(String[] args) {
    try {
      if (args.length < 1) {
        usage();
      } else if (args[0].equals("write")) {
        writeAddressBook();
      } else if (args[0].equals("read")) {
        printAddressBook();
      } else {
        usage();
      }
    } catch (java.io.IOException e) {
      System.out.println("io exception: "  + e);
    }
  }
}
{% endhighlight %}


To read a message:

```
$ echo '(people = [(id = 123, name = "Alice",' \
'email = "alice@example.com", employment = (school = "MIT"))])' \
| zap encode --packed examples/src/main/schema/addressbook.zap \
AddressBook \
| java -cp runtime/target/classes:examples/target/classes \
org.zap.examples.AddressbookMain read
```

To write a message:

```
$ java -cp runtime/target/classes:examples/target/classes \
org.zap.examples.AddressbookMain write \
| zap decode --packed examples/src/main/schema/addressbook.zap \
AddressBook
```

## API

The classes and methods provided by the
Java runtime and generated code
correspond directly to those
provided by the
[C++ implementation](https://zap-proto.io/cxx.html),
with just a few adjustments.

- Java does not have unsigned integer types, so a `UInt64`
in a schema gets mapped to a `long` in Java, a `UInt32` gets
mapped to an `int` in Java, and so on.
You are responsible for correctly handling
arithmetic on values of these types. Note that Java 8 has
standard functions that can help with this.

- Because Java generics don't get monomorphized at compile time
like C++ templates do, generic methods
need to have an additional *factory* argument to
allow the proper dispatch to occur.
`MessageReader.getRoot()` and `MessageBuilder.initRoot()` are two examples,
as shown above.

## Tips

- The main I/O methods in
`Serialize` and `SerializePacked` are written in terms
of `WritableByteChannel` and `ReadableByteChannel`.
You should be very careful if you try to convert a
`java.io.OutputStream`
to a `WritableByteChannel` with the
`java.nio.channels.Channels.newChannel()` method.
If your `OutputStream` was buffered, the new channel-based
wrapper of it will have no way to flush it!
Note that the stream returned by `Process.getOutputStream()` is buffered.

## Future Work

There's a lot left to do, and we'd love to have your help! Here are some missing pieces:

- [Orphans](https://zap-proto.io/cxx.html#orphans).
- [Dynamic reflection](https://zap-proto.io/cxx.html#dynamic-reflection).
- Optimizations, e.g. iterators for `StructList` that update in place instead of allocating for each element.
- Improvements for build and packaging, e.g. getting a distribution on Maven.
- The entire [object-capability RPC layer](https://zap-proto.io/rpc.html).
