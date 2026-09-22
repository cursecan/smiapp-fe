import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

const DocEditor = () => {
    const editor = useEditor({
        extensions: [
        StarterKit,
        ],
        content: '<p>Hello World!</p>',
    })

  return (
    <div>
      <EditorContent editor={editor} />
    </div>
  )
}

export default DocEditor