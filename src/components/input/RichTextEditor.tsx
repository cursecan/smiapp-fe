import { useEffect, useRef } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import { Extension, Node } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Paragraph from '@tiptap/extension-paragraph'
import Heading from '@tiptap/extension-heading'
import Image from '@tiptap/extension-image'
import Underline from '@tiptap/extension-underline'
import { TextStyle } from '@tiptap/extension-text-style'
import FontFamily from '@tiptap/extension-font-family'
import { Table } from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import FlexRow from './flex/FlexRow'
import './css/RichTextEditor.css'

type RichTextEditorProps = {
  content: string
  editable?: boolean
  onUpdate?: (html: string) => void
}

function setCssProperty(
  style: string | null | undefined,
  property: string,
  value: string | null
): string | null {
  const styles = new Map<string, string>()
  ;(style || '').split(';').forEach((item) => {
    const index = item.indexOf(':')
    if (index === -1) return
    const key = item.slice(0, index).trim().toLowerCase()
    const val = item.slice(index + 1).trim()
    if (key) styles.set(key, val)
  })

  const normalizedProperty = property.toLowerCase()
  if (value === null) {
    styles.delete(normalizedProperty)
  } else {
    styles.set(normalizedProperty, value)
  }

  if (styles.size === 0) return null
  return Array.from(styles.entries()).map(([k, v]) => `${k}: ${v}`).join('; ') + ';'
}

const createAttributeConfig = (attrName: string) => ({
  default: null,
  parseHTML: (el: HTMLElement) => el.getAttribute(attrName),
  renderHTML: (attrs: Record<string, any>) => 
    attrs[attrName] ? { [attrName]: attrs[attrName] } : {},
})

const commonAttributes = () => ({
  style: createAttributeConfig('style'),
  class: createAttributeConfig('class'),
})

const FontSize = Extension.create({
  name: 'fontSize',
  addGlobalAttributes() {
    return [{
      types: ['textStyle'],
      attributes: {
        fontSize: {
          default: null,
          parseHTML: (element: HTMLElement) => element.style.fontSize || null,
          renderHTML: (attributes: { fontSize?: string | null }) => 
            attributes.fontSize ? { style: `font-size: ${attributes.fontSize};` } : {},
        },
      },
    }]
  },
  addCommands() {
    return {
      setFontSize: (fontSize: string) => ({ chain }) => 
        chain().setMark('textStyle', { fontSize }).run(),
      unsetFontSize: () => ({ chain }) => 
        chain().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run(),
    }
  },
})

const CustomParagraph = Paragraph.extend({
  addAttributes() {
    return { ...this.parent?.(), ...commonAttributes() }
  },
})

const CustomHeading = Heading.extend({
  addAttributes() {
    return { ...this.parent?.(), ...commonAttributes() }
  },
})

const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      ...commonAttributes(),
      width: createAttributeConfig('width'),
      height: createAttributeConfig('height'),
      alt: createAttributeConfig('alt'),
    }
  },
})

const CustomTable = Table.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      ...commonAttributes(),
      width: createAttributeConfig('width'),
      cellpadding: createAttributeConfig('cellpadding'),
      cellspacing: createAttributeConfig('cellspacing'),
    }
  },
})

const CustomTableCell = TableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      ...commonAttributes(),
      width: createAttributeConfig('width'),
    }
  },
})

const CustomTableHeader = TableHeader.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      ...commonAttributes(),
      width: createAttributeConfig('width'),
    }
  },
})

const TwoColumn = Node.create({
  name: 'twoColumn',
  group: 'block',
  content: 'column column',
  defining: true,
  parseHTML: () => [{ tag: 'div.two-column' }],
  addAttributes() {
    return {
      style: createAttributeConfig('style'),
      class: {
        default: 'two-column',
        parseHTML: (el: HTMLElement) => el.getAttribute('class') || 'two-column',
        renderHTML: (attrs) => ({ class: attrs.class || 'two-column' }),
      },
    }
  },
  renderHTML: ({ HTMLAttributes }) => ['div', HTMLAttributes, 0],
})

const Column = Node.create({
  name: 'column',
  group: 'block',
  content: 'block+',
  defining: true,
  parseHTML: () => [{ tag: 'div.column' }],
  addAttributes() {
    return {
      style: createAttributeConfig('style'),
      class: {
        default: 'column',
        parseHTML: (el: HTMLElement) => el.getAttribute('class') || 'column',
        renderHTML: (attrs) => ({ class: attrs.class || 'column' }),
      },
    }
  },
  renderHTML: ({ HTMLAttributes }) => ['div', HTMLAttributes, 0],
})

const PageBreak = Node.create({
  name: 'pageBreak',
  group: 'block',
  atom: true,
  selectable: true,
  defining: true,
  parseHTML: () => [{ tag: 'div.page-break' }],
  addAttributes() {
    return {
      class: {
        default: 'page-break',
        parseHTML: (el: HTMLElement) => {
          const className = el.getAttribute('class')
          return className?.split(/\s+/).includes('page-break') ? className : 'page-break'
        },
        renderHTML: (attrs) => {
          const className = attrs.class || 'page-break'
          return {
            class: className.split(/\s+/).includes('page-break') 
              ? className 
              : `page-break ${className}`,
          }
        },
      },
      style: createAttributeConfig('style'),
    }
  },
  renderHTML: ({ HTMLAttributes }) => ['div', HTMLAttributes],
})

function restorePageBreaks(previousHTML: string, currentHTML: string): string {
  if (!previousHTML) return currentHTML

  const previousParser = new DOMParser()
  const currentParser = new DOMParser()
  const prevDoc = previousParser.parseFromString(previousHTML, 'text/html')
  const currDoc = currentParser.parseFromString(currentHTML, 'text/html')

  const prevBreaks = prevDoc.querySelectorAll('.page-break').length
  const currBreaks = currDoc.querySelectorAll('.page-break').length

  if (prevBreaks > currBreaks) {
    const missingCount = prevBreaks - currBreaks
    for (let i = 0; i < missingCount; i++) {
      const pageBreak = currDoc.createElement('div')
      pageBreak.setAttribute('class', 'page-break')
      currDoc.body.appendChild(pageBreak)
    }
    return currDoc.body.innerHTML
  }

  return currentHTML
}

export default function RichTextEditor({
  content,
  editable = false,
  onUpdate = () => {},
}: RichTextEditorProps) {
  const lastHTMLRef = useRef(content)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ paragraph: false, heading: false }),
      CustomParagraph,
      CustomHeading,
      TwoColumn,
      Column,
      PageBreak,
      CustomImage.configure({ inline: true }),
      Underline,
      TextStyle,
      FontFamily.configure({ types: ['textStyle'] }),
      FontSize,
      CustomTable.configure({ resizable: false }),
      TableRow,
      CustomTableHeader,
      CustomTableCell,
      FlexRow,
    ],
    content,
    editable,
    editorProps: {
      attributes: {
        class: 'tiptap min-h-[400px] p-4 focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      const currentHTML = editor.getHTML()
      const finalHTML = restorePageBreaks(lastHTMLRef.current, currentHTML)
      lastHTMLRef.current = finalHTML
      onUpdate(finalHTML)
    },
  })

  useEffect(() => {
    if (editor && editor.isEditable !== editable) {
      editor.setEditable(editable)
    }
  }, [editor, editable])

  useEffect(() => {
    if (!editor || content === lastHTMLRef.current) return

    if (content !== editor.getHTML()) {
      editor.commands.setContent(content, { emitUpdate: false })
    }
    lastHTMLRef.current = content
  }, [editor, content])

  const setTextAlign = (alignment: 'left' | 'center' | 'right' | 'justify') => {
    if (!editor || !editable) return

    const nodeType = editor.state.selection.$from.parent.type.name
    if (nodeType !== 'paragraph' && nodeType !== 'heading') return

    const currentStyle = editor.getAttributes(nodeType).style as string | null
    const newStyle = setCssProperty(currentStyle, 'text-align', alignment)

    editor.chain().focus().updateAttributes(nodeType, { style: newStyle }).run()
  }

  if (!editor) return null

  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="flex flex-wrap gap-2 border-b bg-gray-50 p-2">
        <button
          type="button"
          disabled={!editable}
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'rounded bg-gray-300 px-3 py-1' : 'rounded border px-3 py-1'}
        >
          <b>B</b>
        </button>

        <button
          type="button"
          disabled={!editable}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'rounded bg-gray-300 px-3 py-1' : 'rounded border px-3 py-1'}
        >
          <i>I</i>
        </button>

        <button
          type="button"
          disabled={!editable}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive('underline') ? 'rounded bg-gray-300 px-3 py-1' : 'rounded border px-3 py-1'}
        >
          <u>U</u>
        </button>

        <div className="mx-1 border-l" />

        {(['left', 'center', 'right', 'justify'] as const).map((align) => (
          <button
            key={align}
            type="button"
            disabled={!editable}
            onClick={() => setTextAlign(align)}
            className="rounded border px-3 py-1 capitalize"
          >
            {align}
          </button>
        ))}
      </div>

      <div className="a4-page w-[210mm] min-h-[297mm] bg-white p-[10mm]">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}