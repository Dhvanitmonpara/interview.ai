import { useState } from 'react';
import { Button } from '../ui/button';
import { ExecuteCode } from './ExecuteCode';
import { Loader } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OutputProps {
    language: string;
    editorRef: React.RefObject<any>;
}

const Output: React.FC<OutputProps> = ({ language, editorRef }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [output, setOutput] = useState(null);

    const { toast } = useToast();

    const runCode = async () => {
        const sourceCode = editorRef.current.getValue();
        if (!sourceCode) return
        try {
            setIsLoading(true)
            const { run: result } = await ExecuteCode(language, sourceCode);
            setOutput(result.output);
            result.stderr ? setIsError(true) : setIsError(false);
        } catch (error) {
            console.error('Error executing code:', error ? error : error);
            toast({
                variant: "destructive",
                description: 'Error executing code'
            })
        } finally {
            setIsLoading(false)
        }
    };

    return (
        <div className='h-[400px] w-full bg-gray-200'>
            <Button onClick={runCode} >
                {isLoading ? <Loader className='animate-spin' /> : "Run"}
            </Button>
            <div className='dark:text-black p-5'>
                {output ? output : "Click 'Run Code' to see the output"}
                {isError ? isError : null}
            </div>
        </div>
    );
};

export default Output;
