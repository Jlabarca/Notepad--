ace.define('ace/theme/terminal', ['require', 'exports', 'module', 'ace/lib/dom'], (acequire, exports, module) => {
    exports.isDark = true;
    exports.cssClass = 'ace-terminal-theme';
    exports.cssText = "\
    #editor {\
        font-family: 'Nouveau_IBM_Stretch';\
        src: url('Nouveau_IBM_Stretch.ttf') format('truetype');\
        -webkit-app-region: no-drag;\
        font-size: large;\
        display: inline-block;\
        color: #c2c2c2;\
        text-shadow: 0 0 2px white, 0 0 1px rgba(255, 215, 0, 0.75), 0.03em 0 0.06em rgba(255, 0, 0, 0.9), -0.03em 0 0.06em rgba(0, 255, 255, 0.9);\
        animation: chroab 400ms ease-in both;}\
    @keyframes chroab {\
        0% {\
            text-shadow: 0 0 #a50610, 0 0 #003CAA, 0 6px 0 transparent, 2px 0 0 transparent;}\
          100% {\
            text-shadow: 0.04ex 0 #a50610, -0.04ex 0 #003CAA, 0ex 0 rgba(0, 0, 0, 0.8), 0ex 0 0 rgba(0, 0, 0, 0.8);\
        }}\
    .ace-terminal-theme .ace_gutter {\
        background-color: #0000AA\
        color: b2b2b2\
        }\
        .ace-terminal-theme .ace_print-margin {\
        width: 1px;\
        background: #0000AA\
        }\
        .ace-terminal-theme {\
        background-color: #0000AA;\
        color: #b2b2b2\
        }\
        .ace-terminal-theme .ace_cursor {\
        color: gray\
        }\
        .ace-terminal-theme .ace_marker-layer .ace_selection {\
        background: #7F0055\
        }\
        .ace-terminal-theme.ace_multiselect .ace_selection.ace_start {\
        box-shadow: 0 0 3px 0px black;\
        }\
        .ace-terminal-theme .ace_marker-layer .ace_step {\
        background: rgb(0, 0, 0)\
        }\
        .ace-terminal-theme .ace_marker-layer .ace_bracket {\
        background: #090;\
        }\
        .ace-terminal-theme .ace_marker-layer .ace_bracket-start {\
        background: #090;\
        }\
        .ace-terminal-theme .ace_marker-layer .ace_bracket-unmatched {\
        margin: -1px 0 0 -1px;\
        border: 1px solid #900\
        }\
        .ace-terminal-theme .ace_marker-layer .ace_active-line {\
        background: #0000AA\
        }\
        .ace-terminal-theme .ace_gutter-active-line {\
        background-color: #0000AA\
        color: b2b2b2\
        }\
        .ace-terminal-theme .ace_marker-layer .ace_selected-word {\
        border: 1px solid #0000AA\
        }\
        .ace-terminal-theme .ace_invisible {\
        color: #0000AA\
        }\
        .ace-terminal-theme .ace_keyword,\
        .ace-terminal-theme .ace_meta,\
        .ace-terminal-theme .ace_storage,\
        .ace-terminal-theme .ace_storage.ace_type,\
        .ace-terminal-theme .ace_support.ace_type {\
        color: tomato\
        }\
        .ace-terminal-theme .ace_keyword.ace_operator {\
        color: deeppink\
        }\
        .ace-terminal-theme .ace_constant.ace_character,\
        .ace-terminal-theme .ace_constant.ace_language,\
        .ace-terminal-theme .ace_constant.ace_numeric,\
        .ace-terminal-theme .ace_keyword.ace_other.ace_unit,\
        .ace-terminal-theme .ace_support.ace_constant,\
        .ace-terminal-theme .ace_variable.ace_parameter {\
        color: #E78C45\
        }\
        .ace-terminal-theme .ace_constant.ace_other {\
        color: gold\
        }\
        .ace-terminal-theme .ace_invalid {\
        color: yellow;\
        background-color: red\
        }\
        .ace-terminal-theme .ace_invalid.ace_deprecated {\
        color: #CED2CF;\
        background-color: #B798BF\
        }\
        .ace-terminal-theme .ace_fold {\
        background-color: #7AA6DA;\
        border-color: #DEDEDE\
        }\
        .ace-terminal-theme .ace_entity.ace_name.ace_function,\
        .ace-terminal-theme .ace_support.ace_function,\
        .ace-terminal-theme .ace_variable {\
        color: #7AA6DA\
        }\
        .ace-terminal-theme .ace_support.ace_class,\
        .ace-terminal-theme .ace_support.ace_type {\
        color: #E7C547\
        }\
        .ace-terminal-theme .ace_heading,\
        .ace-terminal-theme .ace_string {\
        color: #B9CA4A\
        }\
        .ace-terminal-theme .ace_entity.ace_name.ace_tag,\
        .ace-terminal-theme .ace_entity.ace_other.ace_attribute-name,\
        .ace-terminal-theme .ace_meta.ace_tag,\
        .ace-terminal-theme .ace_string.ace_regexp,\
        .ace-terminal-theme .ace_variable {\
        color: #D54E53\
        }\
        .ace-terminal-theme .ace_comment {\
        color: orangered\
        }\
        .ace-terminal-theme .ace_indent-guide {\
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWNgYGBgYLBWV/8PAAK4AYnhiq+xAAAAAElFTkSuQmCC) right repeat-y;\
        }\
";

    const dom = acequire('../lib/dom');
    dom.importCssString(exports.cssText, exports.cssClass);
});