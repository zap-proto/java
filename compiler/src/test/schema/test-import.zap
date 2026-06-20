@0xd693321951fee8f3;

using Java = import "/zap/java.zap";
$Java.package("org.zap.testimport");
$Java.outerClassname("TestImport");


using import "test.zap".TestAllTypes;

struct Foo {
  importedStruct @0 :TestAllTypes;
}
