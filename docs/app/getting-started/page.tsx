export default function GettingStarted() {
  return (
    <div className="prose">
      <h1>Getting Started</h1>

      <p>
        This guide covers installing Cap'n Proto for Java and creating your first schema.
      </p>

      <h2>Prerequisites</h2>
      <ul>
        <li>Java 8 or later</li>
        <li>Maven or Gradle build tool</li>
        <li>Cap'n Proto compiler (capnp) installed on your system</li>
      </ul>

      <h2>Install Cap'n Proto Compiler</h2>

      <h3>macOS</h3>
      <pre><code className="language-bash">{`brew install capnp`}</code></pre>

      <h3>Ubuntu/Debian</h3>
      <pre><code className="language-bash">{`sudo apt-get install capnproto`}</code></pre>

      <h3>From Source</h3>
      <pre><code className="language-bash">{`curl -O https://capnproto.org/capnproto-c++-1.0.2.tar.gz
tar xzf capnproto-c++-1.0.2.tar.gz
cd capnproto-c++-1.0.2
./configure
make -j$(nproc)
sudo make install`}</code></pre>

      <h2>Maven Setup</h2>

      <p>Add the runtime dependency to your <code>pom.xml</code>:</p>

      <pre><code className="language-xml">{`<dependencies>
  <dependency>
    <groupId>org.capnproto</groupId>
    <artifactId>runtime</artifactId>
    <version>0.1.17</version>
  </dependency>
</dependencies>`}</code></pre>

      <p>Configure the compiler plugin to generate Java code from schemas:</p>

      <pre><code className="language-xml">{`<build>
  <plugins>
    <plugin>
      <groupId>org.codehaus.mojo</groupId>
      <artifactId>exec-maven-plugin</artifactId>
      <version>3.1.0</version>
      <executions>
        <execution>
          <id>generate-capnp</id>
          <phase>generate-sources</phase>
          <goals>
            <goal>exec</goal>
          </goals>
          <configuration>
            <executable>capnp</executable>
            <arguments>
              <argument>compile</argument>
              <argument>-ojava:src/main/java</argument>
              <argument>--src-prefix=src/main/schema</argument>
              <argument>src/main/schema/myschema.capnp</argument>
            </arguments>
          </configuration>
        </execution>
      </executions>
    </plugin>
  </plugins>
</build>`}</code></pre>

      <h2>Gradle Setup</h2>

      <p>Add the runtime dependency to your <code>build.gradle</code>:</p>

      <pre><code className="language-groovy">{`dependencies {
    implementation 'org.capnproto:runtime:0.1.17'
}

task generateCapnp(type: Exec) {
    commandLine 'capnp', 'compile',
        '-ojava:src/main/java',
        '--src-prefix=src/main/schema',
        'src/main/schema/myschema.capnp'
}

compileJava.dependsOn generateCapnp`}</code></pre>

      <h3>Gradle Kotlin DSL</h3>

      <pre><code className="language-kotlin">{`dependencies {
    implementation("org.capnproto:runtime:0.1.17")
}

tasks.register<Exec>("generateCapnp") {
    commandLine("capnp", "compile",
        "-ojava:src/main/java",
        "--src-prefix=src/main/schema",
        "src/main/schema/myschema.capnp")
}

tasks.compileJava {
    dependsOn("generateCapnp")
}`}</code></pre>

      <h2>Create Your First Schema</h2>

      <p>Create <code>src/main/schema/person.capnp</code>:</p>

      <pre><code className="language-capnp">{`@0xdbb9ad1f14bf0b36;

using Java = import "/capnp/java.capnp";
$Java.package("com.example");
$Java.outerClassname("Person");

struct Person {
  id @0 :UInt32;
  name @1 :Text;
  email @2 :Text;
  age @3 :UInt8;
}`}</code></pre>

      <h2>Generate Java Code</h2>

      <p>Run the compiler to generate Java classes:</p>

      <pre><code className="language-bash">{`# Maven
mvn generate-sources

# Gradle
gradle generateCapnp`}</code></pre>

      <p>
        This creates <code>Person.java</code> with nested <code>Person.Builder</code> and{' '}
        <code>Person.Reader</code> classes.
      </p>

      <h2>Use Generated Code</h2>

      <pre><code className="language-java">{`import org.capnproto.MessageBuilder;
import org.capnproto.MessageReader;
import org.capnproto.Serialize;
import com.example.Person;

import java.io.FileOutputStream;
import java.io.FileInputStream;
import java.nio.channels.FileChannel;

public class Example {
    public static void main(String[] args) throws Exception {
        // Build a message
        MessageBuilder message = new MessageBuilder();
        Person.Builder person = message.initRoot(Person.factory);
        person.setId(1);
        person.setName("Alice");
        person.setEmail("alice@example.com");
        person.setAge((byte) 30);

        // Write to file
        try (FileOutputStream fos = new FileOutputStream("person.bin")) {
            Serialize.write(fos.getChannel(), message);
        }

        // Read from file
        try (FileInputStream fis = new FileInputStream("person.bin")) {
            MessageReader reader = Serialize.read(fis.getChannel());
            Person.Reader p = reader.getRoot(Person.factory);

            System.out.println("ID: " + p.getId());
            System.out.println("Name: " + p.getName());
            System.out.println("Email: " + p.getEmail());
            System.out.println("Age: " + p.getAge());
        }
    }
}`}</code></pre>

      <h2>Next Steps</h2>
      <ul>
        <li><a href="/capnp-java/api/">API Reference</a> - Learn the core classes</li>
        <li><a href="/capnp-java/plugin/">Compiler Plugin</a> - Schema annotations and options</li>
        <li><a href="/capnp-java/examples/">Examples</a> - Complete working examples</li>
      </ul>
    </div>
  )
}
