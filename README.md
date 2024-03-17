Replace the following line 

"retriever.release()"

in "C:\Users\Zeeshan Ali\Desktop\react-native\primo_caro\node_modules\react-native-create-thumbnail\android\src\main\java\com\createthumbnail\CreateThumbnailModule.java"

with the following piece of code

try {
    retriever.release();
} catch(IOException e) {
    e.printStackTrace();
}