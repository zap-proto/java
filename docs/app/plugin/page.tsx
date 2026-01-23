export default function Plugin() {
  return (
    <div className="prose">
      <h1>Compiler Plugin</h1>

      <p>
        The Cap'n Proto compiler generates Java code from schema files. This page covers
        installation, usage, and Java-specific annotations.
      </p>

      <h2>Installing the Java Plugin</h2>

      <p>
        The Java code generator is bundled with the capnp-java project. Build it from source:
      </p>

      <pre><code className="language-bash">{`git clone https://github.com/zap-protocol/capnp-java.git
cd capnp-java
mvn package -DskipTests

# The plugin JAR is in compiler/target/
export CAPNP_JAVA_JAR=$(pwd)/compiler/target/capnpc-java-0.1.17-SNAPSHOT.jar`}</code></pre>

      <h2>Running the Compiler</h2>

      <h3>Direct Command</h3>
      <pre><code className="language-bash">{`capnp compile -ojava:src/main/java src/main/schema/myschema.capnp`}</code></pre>

      <h3>With Source Prefix</h3>
      <pre><code className="language-bash">{`capnp compile \\
  -ojava:src/main/java \\
  --src-prefix=src/main/schema \\
  src/main/schema/myschema.capnp`}</code></pre>

      <h3>Multiple Schema Files</h3>
      <pre><code className="language-bash">{`capnp compile \\
  -ojava:src/main/java \\
  --src-prefix=src/main/schema \\
  src/main/schema/*.capnp`}</code></pre>

      <h2>Java Annotations</h2>

      <p>
        Cap'n Proto provides Java-specific annotations to control code generation.
        Import the Java annotation file at the top of your schema:
      </p>

      <pre><code className="language-capnp">{`using Java = import "/capnp/java.capnp";`}</code></pre>

      <h3>$Java.package</h3>
      <p>Sets the Java package for generated code.</p>
      <pre><code className="language-capnp">{`$Java.package("com.example.myapp");`}</code></pre>

      <h3>$Java.outerClassname</h3>
      <p>Sets the outer class name that wraps all generated structs.</p>
      <pre><code className="language-capnp">{`$Java.outerClassname("MySchema");`}</code></pre>

      <h2>Complete Schema Example</h2>

      <pre><code className="language-capnp">{`@0xdbb9ad1f14bf0b36;  # Unique file ID

using Java = import "/capnp/java.capnp";
$Java.package("com.example.addressbook");
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

      <h2>Maven Integration</h2>

      <p>Use the exec-maven-plugin to run the compiler during build:</p>

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
            <workingDirectory>\${project.basedir}</workingDirectory>
            <arguments>
              <argument>compile</argument>
              <argument>-ojava:\${project.build.sourceDirectory}</argument>
              <argument>--src-prefix=src/main/schema</argument>
              <argument>src/main/schema/schema.capnp</argument>
            </arguments>
          </configuration>
        </execution>
      </executions>
    </plugin>

    <!-- Add generated sources to compilation -->
    <plugin>
      <groupId>org.codehaus.mojo</groupId>
      <artifactId>build-helper-maven-plugin</artifactId>
      <version>3.3.0</version>
      <executions>
        <execution>
          <id>add-source</id>
          <phase>generate-sources</phase>
          <goals>
            <goal>add-source</goal>
          </goals>
          <configuration>
            <sources>
              <source>\${project.build.directory}/generated-sources/capnp</source>
            </sources>
          </configuration>
        </execution>
      </executions>
    </plugin>
  </plugins>
</build>`}</code></pre>

      <h2>Gradle Integration</h2>

      <pre><code className="language-groovy">{`plugins {
    id 'java'
}

dependencies {
    implementation 'org.capnproto:runtime:0.1.17'
}

def schemaDir = 'src/main/schema'
def generatedDir = "$buildDir/generated-sources/capnp"

sourceSets {
    main {
        java {
            srcDir generatedDir
        }
    }
}

task generateCapnp(type: Exec) {
    inputs.dir schemaDir
    outputs.dir generatedDir

    doFirst {
        mkdir generatedDir
    }

    commandLine 'capnp', 'compile',
        "-ojava:$generatedDir",
        "--src-prefix=$schemaDir"

    fileTree(schemaDir).matching {
        include '**/*.capnp'
    }.each { file ->
        args file.path
    }
}

compileJava.dependsOn generateCapnp`}</code></pre>

      <h2>Schema Import Paths</h2>

      <p>
        The compiler searches for imports in the following locations:
      </p>

      <ol>
        <li>Current directory</li>
        <li>Directories specified with <code>-I</code> flag</li>
        <li>Standard Cap'n Proto include path (usually <code>/usr/include</code> or <code>/usr/local/include</code>)</li>
      </ol>

      <pre><code className="language-bash">{`capnp compile \\
  -I/path/to/imports \\
  -ojava:src/main/java \\
  src/main/schema/myschema.capnp`}</code></pre>

      <h2>Generated File Structure</h2>

      <p>For a schema file <code>myschema.capnp</code> with:</p>

      <pre><code className="language-capnp">{`$Java.package("com.example");
$Java.outerClassname("MySchema");

struct Foo { ... }
struct Bar { ... }`}</code></pre>

      <p>The compiler generates:</p>

      <pre><code>{`src/main/java/com/example/MySchema.java
  - MySchema (outer class)
    - Foo (nested class)
      - Foo.Builder
      - Foo.Reader
      - Foo.factory
    - Bar (nested class)
      - Bar.Builder
      - Bar.Reader
      - Bar.factory`}</code></pre>

      <h2>Generating Unique IDs</h2>

      <p>
        Each schema file requires a unique 64-bit ID. Generate one with:
      </p>

      <pre><code className="language-bash">{`capnp id`}</code></pre>

      <p>Output example:</p>
      <pre><code>{`@0xdbb9ad1f14bf0b36`}</code></pre>

      <h2>Type Mapping</h2>

      <table>
        <thead>
          <tr>
            <th>Cap'n Proto Type</th>
            <th>Java Type</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Void</td><td>org.capnproto.Void</td></tr>
          <tr><td>Bool</td><td>boolean</td></tr>
          <tr><td>Int8</td><td>byte</td></tr>
          <tr><td>Int16</td><td>short</td></tr>
          <tr><td>Int32</td><td>int</td></tr>
          <tr><td>Int64</td><td>long</td></tr>
          <tr><td>UInt8</td><td>byte</td></tr>
          <tr><td>UInt16</td><td>short</td></tr>
          <tr><td>UInt32</td><td>int</td></tr>
          <tr><td>UInt64</td><td>long</td></tr>
          <tr><td>Float32</td><td>float</td></tr>
          <tr><td>Float64</td><td>double</td></tr>
          <tr><td>Text</td><td>org.capnproto.Text.Reader / Builder</td></tr>
          <tr><td>Data</td><td>org.capnproto.Data.Reader / Builder</td></tr>
          <tr><td>List(T)</td><td>StructList, PrimitiveList, TextList, etc.</td></tr>
          <tr><td>enum</td><td>Java enum</td></tr>
          <tr><td>struct</td><td>Nested class with Builder/Reader</td></tr>
        </tbody>
      </table>
    </div>
  )
}
