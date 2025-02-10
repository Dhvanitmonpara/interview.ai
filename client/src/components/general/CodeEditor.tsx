import Editor, { Monaco } from '@monaco-editor/react';
import { useRef, useState } from 'react';
import LanguageSelector from '@/components/general/LanguageSelector';


function CodeEditor() {
    // Use specific type for Monaco Editor
    const editorRef = useRef<any | null>(null);
    const [value, setValue] = useState<string>('');
    const [language, setLanguage] = useState<string>("javascript"); // Default language as lowercase

    const onMount = (editorValue: any) => {
        editorRef.current = editorValue;
        editorRef.current.focus();
    };

    function ChangeLanguage(language: string) {
        setLanguage(language.toLowerCase()); // Ensure language is always lowercase
    }

    return (
        <div className=''>
            <LanguageSelector language={language} ChangeLanguage={ChangeLanguage} />

            <Editor
                height="70vh"
                width="100%"
                theme='vs-dark'
                value={value}
                onMount={onMount}
                onChange={(e: string | undefined) => {
                    if (e) setValue(e);
                }}
                language={language}
                defaultValue="// some comment"
            />
        </div>
    );
}

export default CodeEditor;
