import { useState, useMemo, useRef, useEffect, ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { Slate, Editable, ReactEditor, withReact, useSlate } from 'slate-react';
import { Editor, Transforms, Text, createEditor, Descendant, Range } from 'slate';

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

const Button = styled.span<{ reversed: boolean; active: boolean }>`
  ${({ active, reversed }) => css`
    cursor: pointer;
    color: ${reversed ? (active ? 'white' : '#aaa') : active ? 'black' : '#ccc'};
  `}
`;

const Icon = styled.span`
  font-size: 18px;
  vertical-align: text-bottom; ;
`;

export const Menu = styled.div`
  & > * {
    display: inline-block;
  }

  & > * + * {
    margin-left: 15px;
  }

  padding: 8px 7px 6px;
  position: absolute;
  z-index: 1;
  top: -10000px;
  left: -10000px;
  margin-top: -6px;
  opacity: 0;
  background-color: #222;
  border-radius: 4px;
  transition: opacity 0.75s;
`;

const Portal = ({ children }: { children: ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    return () => setMounted(false);
  }, []);

  return <>{children}</>;
};

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 100px;
`;

export default HoveringMenuExample;
