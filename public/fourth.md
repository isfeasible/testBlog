```html
<script src="jquery.min.js"></script>
<script src="editormd.min.js"></script>
<script type="text/javascript">
    $(function() {
        var editor = editormd("editormd", {
            path : "../lib/" // Autoload modules mode, codemirror, marked... dependents libs path
        });

        /*
        // or
        var editor = editormd({
            id   : "editormd",
            path : "../lib/"
        });
        */
    });
</script>
```
