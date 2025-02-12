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
    const [language, setLanguage] = useState<string>('javascript');

    const onMount = (editorValue: any) => {
        editorRef.current = editorValue;
        if (editorRef.current && typeof editorRef.current.focus === 'function') {
            editorRef.current.focus();
        }
    };

    function ChangeLanguage(language: string) {
        setLanguage(language.toLowerCase());
    }
        return (
            <div className="flex">
                <div>
                    <LanguageSelector language={language} ChangeLanguage={ChangeLanguage} />
                    <Editor
                        height="70vh"
                        width="600px"
                        theme="vs-dark"
                        value={value}
                        onMount={onMount}
                        onChange={(e: string | undefined) => {
                            if (e) setValue(e);
                        }}
                        language={language}
                        defaultValue="// some comment"
                    />
                </div>
                <Output language={language} editorRef={editorRef} />
            </div>
        );
    }

    export default CodeEditor
