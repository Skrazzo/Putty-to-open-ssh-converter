import { Button } from "./components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert";
import { Shield, Download, Github, Upload, AlertTriangle } from "lucide-react";
import { useForm, useStore } from "@tanstack/react-form";

interface UploadForm {
    key: File | null;
}

export default function KeyConverterPage() {
    const form = useForm({
        defaultValues: {
            key: null,
        } as UploadForm,
        onSubmit(props) {
            console.log(props);
        },
    });

    const { key } = useStore(form.store, (state) => state.values);

    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">PPK to PEM Key Converter</CardTitle>
                    <CardDescription>Convert your PuTTY Private Key (PPK) files to PEM format</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    <Alert variant="default" className="bg-primary/5 border-primary/20">
                        <Shield className="h-4 w-4" />
                        <AlertTitle>Your privacy is important</AlertTitle>
                        <AlertDescription>
                            Conversation is happening on the server, because we need putty-gen cli application to
                            convert your keys. After keys are converted, originals are deleted from the server.
                        </AlertDescription>
                    </Alert>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            form.handleSubmit();
                        }}
                        className="space-y-4"
                    >
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
                            <form.Field
                                name="key"
                                children={(field) => {
                                    return (
                                        <>
                                            <input
                                                id={field.name}
                                                type="file"
                                                accept=".ppk"
                                                onChange={(e) =>
                                                    field.handleChange(e.target.files ? e.target.files[0] : null)
                                                }
                                                className="hidden"
                                            />
                                            <label
                                                htmlFor={field.name}
                                                className="cursor-pointer flex flex-col items-center justify-center gap-2"
                                            >
                                                <Upload className="h-8 w-8 text-gray-500" />
                                                <span className="font-medium">
                                                    {key ? key.name : "Click to select a PPK file"}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    {key
                                                        ? `${(key.size / 1024).toFixed(2)} KB`
                                                        : "or drag and drop it here"}
                                                </span>
                                            </label>
                                        </>
                                    );
                                }}
                            />
                        </div>

                        <Button onClick={() => console.log("Handle convert")} disabled={true} className="w-full">
                            Convert to PEM
                            {/* {isConverting ? "Converting..." : "Convert to PEM"} */}
                        </Button>

                        {/* Show error */}
                        {false && (
                            <Alert variant="destructive">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{"Error appeared"}</AlertDescription>
                            </Alert>
                        )}

                        {/* {pemKey && ( */}
                        {/*     <div className="space-y-4"> */}
                        {/*         <div className="bg-black/[.05] dark:bg-white/[.06] p-4 rounded-md"> */}
                        {/*             <pre className="text-xs overflow-x-auto whitespace-pre-wrap font-mono"> */}
                        {/*                 {pemKey.substring(0, 100)}... */}
                        {/*             </pre> */}
                        {/*         </div> */}
                        {/*         <Button onClick={handleDownload} className="w-full" variant="outline"> */}
                        {/*             <Download className="mr-2 h-4 w-4" /> */}
                        {/*             Download PEM Key */}
                        {/*         </Button> */}
                        {/*     </div> */}
                        {/* )} */}
                    </form>
                </CardContent>

                <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t pt-6">
                    <p className="text-sm text-gray-500">© {new Date().getFullYear()} PPK to PEM Converter</p>
                    <a
                        href="https://github.com/Skrazzo/Putty-to-open-ssh-converter"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm hover:underline"
                    >
                        <Github className="h-4 w-4" />
                        View on GitHub
                    </a>
                </CardFooter>
            </Card>
        </div>
    );
}
