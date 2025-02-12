import { useState } from 'react';
import { Button } from '../ui/button';
import { ExecuteCode } from './ExecuteCode';
import { Loader } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OutputProps {
    language: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
            setIsError(result.stderr ? true : false);
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
        <div className='h-[300px] absolute bottom-0 left-0 w-full bg-neutral-800 border-t-2 border-neutral-700 text-zinc-100'>
            <Button onClick={runCode} >
                {isLoading ? <Loader className='animate-spin' /> : "Run"}
            </Button>
            <div className='p-5'>
                {output ? output : "Click 'Run Code' to see the output"}
                {isError ? isError : null}
            </div>
        </div>
    );
};

export default Output;
