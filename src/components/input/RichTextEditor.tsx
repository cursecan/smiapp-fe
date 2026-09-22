import { EditorContent, useEditor } from '@tiptap/react';
import { Node } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image'
import { TextStyle } from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import { Extension } from '@tiptap/core';
import {Table} from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import TextAlign from '@tiptap/extension-text-align'
import FlexRow from './flex/FlexRow';
import Paragraph from '@tiptap/extension-paragraph'

import './css/RichTextEditor.css'
import { useEffect } from 'react';

const FontSize = Extension.create({
  name: 'fontSize',

  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],

        attributes: {
          fontSize: {
            default: null,

            parseHTML: (element) => {
              return element.style.fontSize || null;
            },

            renderHTML: (attributes) => {
              if (!attributes.fontSize) {
                return {};
              }

              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontSize:
        (fontSize: string) =>
        ({ chain }) => {
          return chain
            .setMark('textStyle', {
              fontSize,
            })
            .run();
        },

      unsetFontSize:
        () =>
        ({ chain }) => {
          return chain
            .setMark('textStyle', {
              fontSize: null,
            })
            .removeEmptyTextStyle()
            .run();
        },
    };
  },
});

const CustomParagraph = Paragraph.extend({
  addAttributes() {
    return {
      ...this.parent?.(),

      style: {
        default: null,

        parseHTML: (element) => {
          return element.getAttribute('style')
        },

        renderHTML: (attributes) => {
          if (!attributes.style) {
            return {}
          }

          return {
            style: attributes.style,
          }
        },
      },

      // editable: {
      //   default: true,

      //   parseHTML: (element) => {
      //     return element.getAttribute('contenteditable') !== 'false'
      //   },

      //   renderHTML: (attributes) => {
      //     return {
      //       contenteditable: attributes.editable ? 'true' : 'false',
      //     }
      //   },
      // },
    }
  },
})

const CustomTable = Table.extend({
  addAttributes() {
    return {
      ...this.parent?.(),

      tableClass: {
        default: null,

        parseHTML: (element) => {
          return element.getAttribute('class')
        },

        renderHTML: (attributes) => {
          console.log('render table attributes:', attributes)

          if (!attributes.tableClass) {
            return {}
          }

          return {
            class: attributes.tableClass,
          }
        },
      },
    }
  },
})

const CustomTableCell = TableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),

      style: {
        default: null,

        parseHTML: element => {
          return element.getAttribute('style')
        },

        renderHTML: attributes => {
          if (!attributes.style) {
            return {}
          }

          return {
            style: attributes.style,
          }
        },
      },

      class: {
        default: null,

        parseHTML: (element) => {
          return element.getAttribute('class')
        },

        renderHTML: (attributes) => {
          if (!attributes.class) {
            return {}
          }

          return {
            class: attributes.class,
          }
        },
      },
    }
  },
})

const TwoColumn = Node.create({
  name: 'twoColumn',

  group: 'block',

  content: 'column column',

  defining: true,

  parseHTML() {
    return [
      {
        tag: 'div.two-column',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      {
        ...HTMLAttributes,
        class: 'two-column',
      },
      0,
    ]
  },
})

const Column = Node.create({
  name: 'column',

  content: 'block+',

  defining: true,

  parseHTML() {
    return [
      {
        tag: 'div.column',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      {
        ...HTMLAttributes,
        class: 'column',
      },
      0,
    ]
  },
})

export default function RichTextEditor({content, editable=false}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: false,
      }),
      CustomParagraph,
      Column,
      TwoColumn,
      Image.configure({
        inline: true,
      }),
      TextStyle,

      FontFamily.configure({
        types: ['textStyle'],
      }),

      FontSize,
      CustomTable.configure({
        resizable: false,
      }),

      TableRow,
      TableHeader,
      CustomTableCell,
      TextAlign.configure({
        types: [
          'heading',
          'paragraph',
        ],
      }),
      FlexRow
    ],

    content,
    
    editable,

    editorProps: {
      attributes: {
        class: 'tiptap min-h-[400px] p-4 focus:outline-none',
      },
    },

    onCreate: ({ editor }) => {
      console.log('=== TIPTAP CREATE ===')
      // console.log(editor.getHTML())
      // console.log(editor.getJSON())
    },

    onUpdate: ({ editor }) => {
      console.log('=== TIPTAP UPDATE ===')
      // console.log(editor.getHTML())
      // console.log(editor.getJSON())
    },
  });

  useEffect(() => {
    if (!editor) return

    editor.setEditable(editable)

  }, [editor, editable])

  if (!editor) {
    return null;
  }
  

  const textStyle = editor.getAttributes('textStyle');

  return (
    <div className="overflow-hidden rounded-lg border">

      {/* TOOLBAR */}
      <div className="flex flex-wrap gap-2 border-b bg-gray-50 p-2">

        {/* FONT FAMILY */}
        {/* <select
          value={textStyle.fontFamily || ''}
          onChange={(event) => {
            const value = event.target.value;

            if (!value) {
              editor
                .chain()
                .focus()
                .unsetFontFamily()
                .run();

              return;
            }

            editor
              .chain()
              .focus()
              .setFontFamily(value)
              .run();
          }}
          className="rounded border px-2 py-1"
        >
          <option value="">Default Font</option>

          <option value="Arial">
            Arial
          </option>

          <option value="Helvetica">
            Helvetica
          </option>

          <option value="Times New Roman">
            Times New Roman
          </option>

          <option value="Georgia">
            Georgia
          </option>

          <option value="Verdana">
            Verdana
          </option>

          <option value="Tahoma">
            Tahoma
          </option>

          <option value="Courier New">
            Courier New
          </option>
        </select> */}

        {/* FONT SIZE */}
        {/* <select
          value={textStyle.fontSize || ''}
          onChange={(event) => {
            const value = event.target.value;

            if (!value) {
              editor
                .chain()
                .focus()
                .unsetFontSize()
                .run();

              return;
            }

            editor
              .chain()
              .focus()
              .setFontSize(value)
              .run();
          }}
          className="rounded border px-2 py-1"
        >
          <option value="">Size</option>

          <option value="10px">10</option>
          <option value="11px">11</option>
          <option value="12px">12</option>
          <option value="14px">14</option>
          <option value="16px">16</option>
          <option value="18px">18</option>
          <option value="20px">20</option>
          <option value="24px">24</option>
          <option value="28px">28</option>
          <option value="32px">32</option>
        </select> */}

        {/* BOLD */}
        <button
          type="button"
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleBold()
              .run()
          }
          className={
            editor.isActive('bold')
              ? 'rounded bg-gray-300 px-3 py-1'
              : 'rounded border px-3 py-1'
          }
        >
          <b>B</b>
        </button>

        {/* ITALIC */}
        <button
          type="button"
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleItalic()
              .run()
          }
          className={
            editor.isActive('italic')
              ? 'rounded bg-gray-300 px-3 py-1'
              : 'rounded border px-3 py-1'
          }
        >
          <i>I</i>
        </button>

        {/* UNDERLINE */}
        <button
          type="button"
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleUnderline()
              .run()
          }
          className={
            editor.isActive('underline')
              ? 'rounded bg-gray-300 px-3 py-1'
              : 'rounded border px-3 py-1'
          }
        >
          <u>U</u>
        </button>

        <button
          type="button"
          className={
            editor.isActive('bold')
              ? 'rounded bg-gray-300 px-3 py-1'
              : 'rounded border px-3 py-1'
          }
          onClick={() =>
            editor.chain().focus().setTextAlign('left').run()
          }
        >
          Left
        </button>

        <button
          type="button"
          className={
            editor.isActive('bold')
              ? 'rounded bg-gray-300 px-3 py-1'
              : 'rounded border px-3 py-1'
          }
          onClick={() =>
            editor.chain().focus().setTextAlign('center').run()
          }
        >
          Center
        </button>

        <button
          type="button"
          className={
            editor.isActive('bold')
              ? 'rounded bg-gray-300 px-3 py-1'
              : 'rounded border px-3 py-1'
          }
          onClick={() =>
            editor.chain().focus().setTextAlign('right').run()
          }
        >
          Right
        </button>

        <button
          type="button"
          className={
            editor.isActive('bold')
              ? 'rounded bg-gray-300 px-3 py-1'
              : 'rounded border px-3 py-1'
          }
          onClick={() =>
            editor.chain().focus().setTextAlign('justify').run()
          }
        >
          Justify
        </button>

        {/* BULLET LIST */}
        {/* <button
          type="button"
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleBulletList()
              .run()
          }
          className="rounded border px-3 py-1"
        >
          • List
        </button> */}

        {/* ORDERED LIST */}
        {/* <button
          type="button"
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleOrderedList()
              .run()
          }
          className="rounded border px-3 py-1"
        >
          1. List
        </button> */}

      </div>

      {/* EDITOR */}
      <div className="a4-page w-[210mm] min-h-[297mm] bg-white p-[10mm]">
        <EditorContent editor={editor} />

      </div>

    </div>
  );
}