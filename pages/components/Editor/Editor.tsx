import { useState, useMemo, useRef, useEffect } from 'react';
import { Slate, Editable, ReactEditor, withReact, useSlate } from 'slate-react';
import { Editor, Transforms, Text, createEditor, Descendant, Range } from 'slate';

import { Button, Container, Icon, Menu, Portal } from '../components';

const HoveringMenuExample = () => {
  const [value, setValue] = useState<Descendant[]>(initialValue);
  const editor = useMemo(() => withReact(createEditor()), []);

  return (
    <Container>
      <Slate editor={editor} value={value} onChange={(value) => setValue(value)}>
        <HoveringToolbar />
        <Editable
          renderLeaf={(props) => <Leaf {...props} />}
          placeholder="Enter some text..."
          onDOMBeforeInput={(event: InputEvent) => {
            event.preventDefault();
            switch (event.inputType) {
              case 'formatBold':
                return toggleFormat(editor, 'bold');
              case 'formatItalic':
                return toggleFormat(editor, 'italic');
              case 'formatUnderline':
                return toggleFormat(editor, 'underlined');
            }
          }}
        />
      </Slate>
    </Container>
  );
};

const toggleFormat = (editor: Editor, format: string) => {
  const isActive = isFormatActive(editor, format);
  Transforms.setNodes(
    editor,
    { [format]: isActive ? null : true },
    { match: Text.isText, split: true }
  );
};

const isFormatActive = (editor: Editor, format: string) => {
  // @ts-ignore
  const [match] = Editor.nodes(editor, {
    // @ts-ignore
    match: (n) => n[format] === true,
    mode: 'all',
  });
  return !!match;
};

interface LeafProps {
  children: any;
  leaf: any;
  text: any;
  attributes: {
    'data-slate-leaf': true;
  };
}

const Leaf = ({ attributes, children, leaf }: LeafProps) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underlined) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

const HoveringToolbar = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const editor = useSlate();

  useEffect(() => {
    const el = ref.current;
    const { selection } = editor;

    if (!el) {
      return;
    }

    if (
      !selection ||
      !ReactEditor.isFocused(editor) ||
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === ''
    ) {
      el.removeAttribute('style');
      return;
    }

    const domSelection = window.getSelection();
    const domRange = domSelection!.getRangeAt(0);
    const rect = domRange.getBoundingClientRect();
    el.style.opacity = '1';
    el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight}px`;
    el.style.left = `${rect.left + window.pageXOffset - el.offsetWidth / 2 + rect.width / 2}px`;
  });

  return (
    <Portal>
      <Menu ref={ref}>
        <FormatButton format="bold" icon="B" />
        <FormatButton format="italic" icon="I" />
        <FormatButton format="underlined" icon="U" />
      </Menu>
    </Portal>
  );
};

interface FormatButtonProps {
  format: 'bold' | 'italic' | 'underlined';
  icon: string;
}

const FormatButton = ({ format, icon }: FormatButtonProps) => {
  const editor = useSlate();
  return (
    <Button
      reversed
      active={isFormatActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleFormat(editor, format);
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  );
};

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [
      {
        text: 'This example shows how you can make a hovering menu appear above your content, which you can use to make text ',
      },
      { text: 'bold', bold: true },
      { text: ', ' },
      { text: 'italic', italic: true },
      { text: ', or anything else you might want to do!' },
    ],
  },
  {
    type: 'paragraph',
    children: [
      { text: 'Try it out yourself! Just ' },
      { text: 'select any piece of text and the menu will appear', bold: true },
      { text: '.' },
    ],
  },
];

export default HoveringMenuExample;
