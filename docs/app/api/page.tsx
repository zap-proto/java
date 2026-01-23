export default function ApiReference() {
  return (
    <div className="prose">
      <h1>API Reference</h1>

      <p>
        Core classes for reading and writing Cap'n Proto messages in Java.
      </p>

      <h2>MessageBuilder</h2>

      <p>
        Creates new messages for writing. Allocates segments and manages memory.
      </p>

      <pre><code className="language-java">{`import org.capnproto.MessageBuilder;

// Create with default allocator
MessageBuilder message = new MessageBuilder();

// Create with custom initial segment size
MessageBuilder message = new MessageBuilder(1024);

// Initialize root struct
MyStruct.Builder root = message.initRoot(MyStruct.factory);`}</code></pre>

      <h3>Methods</h3>
      <table>
        <thead>
          <tr>
            <th>Method</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>initRoot(StructFactory)</code></td>
            <td>Initialize and return the root struct builder</td>
          </tr>
          <tr>
            <td><code>getRoot(StructFactory)</code></td>
            <td>Get existing root struct builder</td>
          </tr>
          <tr>
            <td><code>getSegmentsForOutput()</code></td>
            <td>Get segments as ByteBuffer array for serialization</td>
          </tr>
        </tbody>
      </table>

      <h2>MessageReader</h2>

      <p>
        Reads messages from byte buffers. Provides zero-copy access to data.
      </p>

      <pre><code className="language-java">{`import org.capnproto.MessageReader;

// Read from channel
MessageReader reader = Serialize.read(channel);

// Get root struct reader
MyStruct.Reader root = reader.getRoot(MyStruct.factory);`}</code></pre>

      <h3>Methods</h3>
      <table>
        <thead>
          <tr>
            <th>Method</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>getRoot(StructFactory)</code></td>
            <td>Get the root struct reader</td>
          </tr>
        </tbody>
      </table>

      <h2>Serialize</h2>

      <p>
        Standard (unpacked) serialization for Cap'n Proto messages.
      </p>

      <pre><code className="language-java">{`import org.capnproto.Serialize;
import java.nio.channels.ReadableByteChannel;
import java.nio.channels.WritableByteChannel;

// Write to channel
Serialize.write(writableChannel, messageBuilder);

// Read from channel
MessageReader reader = Serialize.read(readableChannel);

// Read with options
ReaderOptions options = new ReaderOptions(
    64 * 1024 * 1024,  // traversalLimitInWords
    64                  // nestingLimit
);
MessageReader reader = Serialize.read(channel, options);`}</code></pre>

      <h3>Methods</h3>
      <table>
        <thead>
          <tr>
            <th>Method</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>write(WritableByteChannel, MessageBuilder)</code></td>
            <td>Write message to channel</td>
          </tr>
          <tr>
            <td><code>read(ReadableByteChannel)</code></td>
            <td>Read message from channel</td>
          </tr>
          <tr>
            <td><code>read(ReadableByteChannel, ReaderOptions)</code></td>
            <td>Read with custom limits</td>
          </tr>
        </tbody>
      </table>

      <h2>SerializePacked</h2>

      <p>
        Packed serialization for smaller wire size. Uses simple compression.
      </p>

      <pre><code className="language-java">{`import org.capnproto.SerializePacked;

// Write packed to channel
SerializePacked.writeToUnbuffered(channel, message);

// Read packed from channel
MessageReader reader = SerializePacked.readFromUnbuffered(channel);`}</code></pre>

      <h3>Methods</h3>
      <table>
        <thead>
          <tr>
            <th>Method</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>writeToUnbuffered(WritableByteChannel, MessageBuilder)</code></td>
            <td>Write packed message</td>
          </tr>
          <tr>
            <td><code>readFromUnbuffered(ReadableByteChannel)</code></td>
            <td>Read packed message</td>
          </tr>
        </tbody>
      </table>

      <h2>StructList</h2>

      <p>
        Lists of struct values. Both Builder and Reader variants.
      </p>

      <pre><code className="language-java">{`import org.capnproto.StructList;

// Building a list
StructList.Builder<Person.Builder> people = addressbook.initPeople(3);
people.get(0).setName("Alice");
people.get(1).setName("Bob");
people.get(2).setName("Carol");

// Reading a list
StructList.Reader<Person.Reader> people = addressbook.getPeople();
for (Person.Reader person : people) {
    System.out.println(person.getName());
}

// Get size
int size = people.size();`}</code></pre>

      <h2>PrimitiveList</h2>

      <p>
        Lists of primitive values: Int8, Int16, Int32, Int64, UInt8, UInt16, UInt32, UInt64, Float, Double.
      </p>

      <pre><code className="language-java">{`import org.capnproto.PrimitiveList;

// Int32 list
PrimitiveList.Int.Builder ints = struct.initValues(5);
ints.set(0, 100);
ints.set(1, 200);

// Float list
PrimitiveList.Float.Reader floats = struct.getFloatValues();
for (int i = 0; i < floats.size(); i++) {
    float value = floats.get(i);
}`}</code></pre>

      <h2>TextList / DataList</h2>

      <p>
        Lists of Text (UTF-8 strings) or Data (raw bytes).
      </p>

      <pre><code className="language-java">{`import org.capnproto.TextList;
import org.capnproto.DataList;

// Text list
TextList.Builder names = struct.initNames(3);
names.set(0, new Text.Reader("Alice"));
names.set(1, new Text.Reader("Bob"));

// Read text list
TextList.Reader names = struct.getNames();
for (Text.Reader name : names) {
    System.out.println(name.toString());
}`}</code></pre>

      <h2>ReaderOptions</h2>

      <p>
        Configure security limits for message reading.
      </p>

      <pre><code className="language-java">{`import org.capnproto.ReaderOptions;

// Default options
ReaderOptions options = ReaderOptions.DEFAULT_READER_OPTIONS;

// Custom limits
ReaderOptions options = new ReaderOptions(
    128 * 1024 * 1024,  // traversalLimitInWords (512MB)
    128                  // nestingLimit
);`}</code></pre>

      <h3>Parameters</h3>
      <table>
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>traversalLimitInWords</code></td>
            <td>8 * 1024 * 1024</td>
            <td>Maximum words to traverse (prevents amplification attacks)</td>
          </tr>
          <tr>
            <td><code>nestingLimit</code></td>
            <td>64</td>
            <td>Maximum struct nesting depth</td>
          </tr>
        </tbody>
      </table>

      <h2>DecodeException</h2>

      <p>
        Thrown when message decoding fails due to invalid data or exceeded limits.
      </p>

      <pre><code className="language-java">{`import org.capnproto.DecodeException;

try {
    MessageReader reader = Serialize.read(channel);
} catch (DecodeException e) {
    System.err.println("Invalid message: " + e.getMessage());
}`}</code></pre>

      <h2>Generated Code Patterns</h2>

      <h3>Struct Factory</h3>
      <p>Each generated struct has a static <code>factory</code> field:</p>
      <pre><code className="language-java">{`// Initialize root
MyStruct.Builder builder = message.initRoot(MyStruct.factory);

// Read root
MyStruct.Reader reader = message.getRoot(MyStruct.factory);`}</code></pre>

      <h3>Builder vs Reader</h3>
      <p>
        Builders are for writing, Readers are for reading. They share method names
        but Builders have setters while Readers only have getters.
      </p>
      <pre><code className="language-java">{`// Builder (writing)
Person.Builder builder = message.initRoot(Person.factory);
builder.setName("Alice");
builder.setAge((byte) 30);

// Reader (reading)
Person.Reader reader = message.getRoot(Person.factory);
String name = reader.getName().toString();
byte age = reader.getAge();`}</code></pre>

      <h3>Unions</h3>
      <p>
        Unions use a <code>which()</code> method to determine which field is set.
      </p>
      <pre><code className="language-java">{`// Check union variant
switch (employment.which()) {
    case UNEMPLOYED:
        // ...
        break;
    case EMPLOYER:
        String employer = employment.getEmployer().toString();
        break;
    case SCHOOL:
        String school = employment.getSchool().toString();
        break;
}`}</code></pre>
    </div>
  )
}
