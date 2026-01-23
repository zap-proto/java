export default function Examples() {
  return (
    <div className="prose">
      <h1>Examples</h1>

      <p>
        Complete working examples demonstrating Cap'n Proto Java usage patterns.
      </p>

      <h2>Address Book Example</h2>

      <p>
        A complete example showing struct, list, enum, and union usage.
      </p>

      <h3>Schema: addressbook.capnp</h3>

      <pre><code className="language-capnp">{`@0x9eb32e19f86ee174;

using Java = import "/capnp/java.capnp";
$Java.package("org.capnproto.examples");
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
  }
}

struct AddressBook {
  people @0 :List(Person);
}`}</code></pre>

      <h3>Java: AddressbookMain.java</h3>

      <pre><code className="language-java">{`package org.capnproto.examples;

import java.io.FileOutputStream;
import java.io.FileInputStream;
import java.io.FileDescriptor;
import org.capnproto.MessageBuilder;
import org.capnproto.MessageReader;
import org.capnproto.SerializePacked;
import org.capnproto.StructList;
import org.capnproto.examples.Addressbook.AddressBook;
import org.capnproto.examples.Addressbook.Person;

public class AddressbookMain {

    public static void writeAddressBook() throws Exception {
        MessageBuilder message = new MessageBuilder();
        AddressBook.Builder addressbook = message.initRoot(AddressBook.factory);
        StructList.Builder<Person.Builder> people = addressbook.initPeople(2);

        // First person: Alice
        Person.Builder alice = people.get(0);
        alice.setId(123);
        alice.setName("Alice");
        alice.setEmail("alice@example.com");

        StructList.Builder<Person.PhoneNumber.Builder> alicePhones =
            alice.initPhones(1);
        alicePhones.get(0).setNumber("555-1212");
        alicePhones.get(0).setType(Person.PhoneNumber.Type.MOBILE);
        alice.getEmployment().setSchool("MIT");

        // Second person: Bob
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
        bob.getEmployment().setUnemployed(org.capnproto.Void.VOID);

        // Write to stdout (packed format)
        SerializePacked.writeToUnbuffered(
            new FileOutputStream(FileDescriptor.out).getChannel(),
            message);
    }

    public static void printAddressBook() throws Exception {
        // Read from stdin (packed format)
        MessageReader message = SerializePacked.readFromUnbuffered(
            new FileInputStream(FileDescriptor.in).getChannel());

        AddressBook.Reader addressbook = message.getRoot(AddressBook.factory);

        for (Person.Reader person : addressbook.getPeople()) {
            System.out.println(person.getName() + ": " + person.getEmail());

            for (Person.PhoneNumber.Reader phone : person.getPhones()) {
                String typeName = switch (phone.getType()) {
                    case MOBILE -> "mobile";
                    case HOME -> "home";
                    case WORK -> "work";
                };
                System.out.println("  " + typeName + " phone: " + phone.getNumber());
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
            }
        }
    }

    public static void main(String[] args) throws Exception {
        if (args.length < 1) {
            System.out.println("usage: addressbook [write | read]");
        } else if (args[0].equals("write")) {
            writeAddressBook();
        } else if (args[0].equals("read")) {
            printAddressBook();
        } else {
            System.out.println("usage: addressbook [write | read]");
        }
    }
}`}</code></pre>

      <h3>Running the Example</h3>

      <pre><code className="language-bash">{`# Write and pipe to read
java AddressbookMain write | java AddressbookMain read

# Output:
# Alice: alice@example.com
#   mobile phone: 555-1212
#   student at: MIT
# Bob: bob@example.com
#   home phone: 555-4567
#   work phone: 555-7654
#   unemployed`}</code></pre>

      <h2>File I/O Example</h2>

      <p>Reading and writing Cap'n Proto messages to files.</p>

      <pre><code className="language-java">{`import org.capnproto.MessageBuilder;
import org.capnproto.MessageReader;
import org.capnproto.Serialize;
import java.io.FileOutputStream;
import java.io.FileInputStream;
import java.nio.channels.FileChannel;

public class FileIOExample {

    public static void writeToFile(String path, MyData.Builder data)
            throws Exception {
        MessageBuilder message = new MessageBuilder();
        MyData.Builder root = message.initRoot(MyData.factory);
        // ... populate root ...

        try (FileOutputStream fos = new FileOutputStream(path);
             FileChannel channel = fos.getChannel()) {
            Serialize.write(channel, message);
        }
    }

    public static MyData.Reader readFromFile(String path) throws Exception {
        try (FileInputStream fis = new FileInputStream(path);
             FileChannel channel = fis.getChannel()) {
            MessageReader reader = Serialize.read(channel);
            return reader.getRoot(MyData.factory);
        }
    }
}`}</code></pre>

      <h2>Network Example</h2>

      <p>Sending Cap'n Proto messages over sockets.</p>

      <pre><code className="language-java">{`import org.capnproto.MessageBuilder;
import org.capnproto.MessageReader;
import org.capnproto.SerializePacked;
import java.net.Socket;
import java.nio.channels.Channels;
import java.nio.channels.ReadableByteChannel;
import java.nio.channels.WritableByteChannel;

public class NetworkExample {

    public static void sendMessage(Socket socket, Request.Builder request)
            throws Exception {
        MessageBuilder message = new MessageBuilder();
        Request.Builder root = message.initRoot(Request.factory);
        // ... populate request ...

        WritableByteChannel channel = Channels.newChannel(
            socket.getOutputStream());
        SerializePacked.writeToUnbuffered(channel, message);
    }

    public static Response.Reader receiveMessage(Socket socket)
            throws Exception {
        ReadableByteChannel channel = Channels.newChannel(
            socket.getInputStream());
        MessageReader reader = SerializePacked.readFromUnbuffered(channel);
        return reader.getRoot(Response.factory);
    }
}`}</code></pre>

      <h2>ByteBuffer Example</h2>

      <p>Working with in-memory ByteBuffers.</p>

      <pre><code className="language-java">{`import org.capnproto.MessageBuilder;
import org.capnproto.MessageReader;
import org.capnproto.ArrayInputStream;
import org.capnproto.ArrayOutputStream;
import org.capnproto.Serialize;
import java.nio.ByteBuffer;

public class ByteBufferExample {

    public static ByteBuffer serialize(MessageBuilder message) throws Exception {
        // Get segments
        ByteBuffer[] segments = message.getSegmentsForOutput();

        // Calculate total size
        int size = 4 + segments.length * 4;  // header
        for (ByteBuffer segment : segments) {
            size += segment.remaining();
        }

        // Allocate and write
        ByteBuffer output = ByteBuffer.allocate(size);
        ArrayOutputStream aos = new ArrayOutputStream(output);
        Serialize.write(aos, message);
        output.flip();
        return output;
    }

    public static MessageReader deserialize(ByteBuffer buffer) throws Exception {
        ArrayInputStream ais = new ArrayInputStream(buffer);
        return Serialize.read(ais);
    }
}`}</code></pre>

      <h2>Security: Reader Options</h2>

      <p>Protect against malicious messages with size limits.</p>

      <pre><code className="language-java">{`import org.capnproto.MessageReader;
import org.capnproto.ReaderOptions;
import org.capnproto.Serialize;
import org.capnproto.DecodeException;

public class SecureReader {

    private static final ReaderOptions STRICT_OPTIONS = new ReaderOptions(
        1024 * 1024,   // 4MB traversal limit (in 8-byte words)
        32             // max nesting depth
    );

    public static MyData.Reader readSecurely(ReadableByteChannel channel) {
        try {
            MessageReader reader = Serialize.read(channel, STRICT_OPTIONS);
            return reader.getRoot(MyData.factory);
        } catch (DecodeException e) {
            throw new SecurityException("Malformed message: " + e.getMessage());
        }
    }
}`}</code></pre>

      <h2>Testing Example</h2>

      <p>Unit testing with Cap'n Proto messages.</p>

      <pre><code className="language-java">{`import org.capnproto.MessageBuilder;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class PersonTest {

    @Test
    void testPersonBuilder() {
        MessageBuilder message = new MessageBuilder();
        Person.Builder person = message.initRoot(Person.factory);

        person.setId(123);
        person.setName("Alice");
        person.setEmail("alice@example.com");

        // Read back via reader
        Person.Reader reader = message.getRoot(Person.factory).asReader();

        assertEquals(123, reader.getId());
        assertEquals("Alice", reader.getName().toString());
        assertEquals("alice@example.com", reader.getEmail().toString());
    }

    @Test
    void testPhoneList() {
        MessageBuilder message = new MessageBuilder();
        Person.Builder person = message.initRoot(Person.factory);

        var phones = person.initPhones(2);
        phones.get(0).setNumber("555-1234");
        phones.get(0).setType(Person.PhoneNumber.Type.MOBILE);
        phones.get(1).setNumber("555-5678");
        phones.get(1).setType(Person.PhoneNumber.Type.WORK);

        Person.Reader reader = person.asReader();
        assertEquals(2, reader.getPhones().size());
    }

    @Test
    void testEmploymentUnion() {
        MessageBuilder message = new MessageBuilder();
        Person.Builder person = message.initRoot(Person.factory);

        person.getEmployment().setSchool("MIT");

        Person.Reader reader = person.asReader();
        assertEquals(
            Person.Employment.Which.SCHOOL,
            reader.getEmployment().which()
        );
        assertEquals("MIT", reader.getEmployment().getSchool().toString());
    }
}`}</code></pre>

      <h2>Project Structure</h2>

      <p>Recommended project layout for Cap'n Proto Java projects:</p>

      <pre><code>{`my-project/
  pom.xml (or build.gradle)
  src/
    main/
      schema/
        myschema.capnp
        common.capnp
      java/
        com/example/
          MyApplication.java
          # Generated code goes here too
    test/
      java/
        com/example/
          MyApplicationTest.java`}</code></pre>
    </div>
  )
}
