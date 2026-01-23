export default function Home() {
  return (
    <div className="prose">
      <h1>Cap'n Proto for Java</h1>

      <p className="text-xl text-muted">
        A pure Java implementation of Cap'n Proto - the insanely fast data interchange format.
      </p>

      <div className="grid md:grid-cols-2 gap-6 my-8">
        <div className="p-6 border border-border rounded-lg">
          <h3 className="mt-0">Zero-Copy Deserialization</h3>
          <p className="text-muted mb-0">
            Read data directly from byte buffers without parsing overhead.
            Access fields lazily for maximum performance.
          </p>
        </div>
        <div className="p-6 border border-border rounded-lg">
          <h3 className="mt-0">Type-Safe Generated Code</h3>
          <p className="text-muted mb-0">
            The compiler generates Java classes with Builder and Reader patterns
            for safe, ergonomic access to your data.
          </p>
        </div>
        <div className="p-6 border border-border rounded-lg">
          <h3 className="mt-0">Compact Wire Format</h3>
          <p className="text-muted mb-0">
            Optional packing reduces message size while maintaining
            zero-copy performance for unpacked messages.
          </p>
        </div>
        <div className="p-6 border border-border rounded-lg">
          <h3 className="mt-0">Schema Evolution</h3>
          <p className="text-muted mb-0">
            Add new fields without breaking compatibility.
            Old readers can safely read new messages.
          </p>
        </div>
      </div>

      <h2>Quick Start</h2>

      <h3>Maven</h3>
      <pre><code className="language-xml">{`<dependency>
  <groupId>org.capnproto</groupId>
  <artifactId>runtime</artifactId>
  <version>0.1.17</version>
</dependency>`}</code></pre>

      <h3>Gradle</h3>
      <pre><code className="language-groovy">{`implementation 'org.capnproto:runtime:0.1.17'`}</code></pre>

      <h2>Usage Example</h2>

      <pre><code className="language-java">{`// Write a message
MessageBuilder message = new MessageBuilder();
AddressBook.Builder addressbook = message.initRoot(AddressBook.factory);
StructList.Builder<Person.Builder> people = addressbook.initPeople(1);

Person.Builder alice = people.get(0);
alice.setId(123);
alice.setName("Alice");
alice.setEmail("alice@example.com");

SerializePacked.writeToUnbuffered(channel, message);

// Read a message
MessageReader reader = SerializePacked.readFromUnbuffered(channel);
AddressBook.Reader book = reader.getRoot(AddressBook.factory);

for (Person.Reader person : book.getPeople()) {
    System.out.println(person.getName() + ": " + person.getEmail());
}`}</code></pre>

      <h2>Documentation</h2>
      <ul>
        <li><a href="/capnp-java/getting-started/">Getting Started</a> - Installation and first steps</li>
        <li><a href="/capnp-java/api/">API Reference</a> - Core classes and interfaces</li>
        <li><a href="/capnp-java/plugin/">Compiler Plugin</a> - Code generation from schemas</li>
        <li><a href="/capnp-java/examples/">Examples</a> - Complete working examples</li>
      </ul>
    </div>
  )
}
