import { useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import LanguageSelector from '@/components/general/LanguageSelector';
import Output from './Output';

interface CodeEditorProps {
    language: string;
    focus: () => void;
    getValue: () => string;
}

function CodeEditor() {
    const editorRef = useRef<CodeEditorProps | null>(null);
    const [value, setValue] = useState<string>('');
    const [isTerminalOpen, setIsTerminalOpen] = useState(false);
    const [language, setLanguage] = useState<string>('javascript');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onMountHandler = (editorValue: any) => {
        editorRef.current = editorValue;
        if (editorRef.current && typeof editorRef.current.focus === 'function') {
            editorRef.current.focus();
        }
    };

    function ChangeLanguage(language: string) {
        setLanguage(language.toLowerCase());
    }
    return (
        <div className="col-span-5 max-h-[90vh] relative">
            <LanguageSelector language={language} ChangeLanguage={ChangeLanguage} />
            
            <Editor
                height="100%"
                width="100%"
                theme="vs-dark"
                value={value}
                onMount={onMountHandler}
                onChange={(e: string | undefined) => {
                    if (e) setValue(e);
                }}
                language={language}
                defaultValue="// Start coding here..."
            />
            <Output language={language} editorRef={editorRef} />
        </div>
    );
}

export default CodeEditor
