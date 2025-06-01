// src/extensions/Iframe.js
import { Node, mergeAttributes } from '@tiptap/core';

export const Iframe = Node.create({
  name: 'iframe',

  group: 'block',

  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      width: {
        default: '100%',
      },
      height: {
        default: '315',
      },
      frameborder: {
        default: '0',
      },
      allowfullscreen: {
        default: true,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'iframe',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['iframe', mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ({ node }) => {
      const iframe = document.createElement('iframe');
      iframe.src = node.attrs.src;
      iframe.width = node.attrs.width;
      iframe.height = node.attrs.height;
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('allowfullscreen', 'true');
      return {
        dom: iframe,
      };
    };
  },
});
