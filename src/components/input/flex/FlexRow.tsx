import { Node } from '@tiptap/core'

const FlexRow = Node.create({
  name: 'flexRow',

  group: 'block',

  content: 'inline*',

  defining: true,

  addAttributes() {
    return {
      justifyContent: {
        default: 'space-between',

        parseHTML: (element) => {
          return element.style.justifyContent || 'space-between'
        },

        renderHTML: (attributes) => {
          return {
            style: `display: flex; justify-content: ${attributes.justifyContent};`,
          }
        },
      },

      alignItems: {
        default: 'center',

        parseHTML: (element) => {
          return element.style.alignItems || 'center'
        },

        renderHTML: (attributes) => {
          return {
            style: `align-items: ${attributes.alignItems};`,
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-flex-row]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      {
        ...HTMLAttributes,
        'data-flex-row': '',
      },
      0,
    ]
  },

  addCommands() {
    return {
      setFlexRow:
        () =>
        ({ commands }) => {
          return commands.wrapIn(this.name)
        },
    }
  },
})

export default FlexRow