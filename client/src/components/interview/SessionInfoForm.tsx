import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import SkillsInput from "./SkillsInput";
import useInterviewStore from "@/store/interviewStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { jobRoleSchema } from "@/types/InterviewData";
import { useUser } from "@clerk/clerk-react";

const formSchema = z.object({
  yearsOfExperience: z
    .number()
    .min(0, "Experience must be a positive number")
    .max(50, "Experience cannot exceed 50 years"),
  jobRole: jobRoleSchema,
  skills: z.array(z.string()).nonempty("At least one skill is required"),
});

function SessionInfoForm() {

  const { setCandidate } = useInterviewStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      yearsOfExperience: 0,
      jobRole: "front-end",
      skills: []
    }
  })

  const navigate = useNavigate()
  const user = useUser().user

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setCandidate({
      email: user?.primaryEmailAddress?.emailAddress || null,
      name: user?.username || null,
      yearsOfExperience: values.yearsOfExperience,
      jobRole: values.jobRole,
      skills: values.skills
    })
    navigate(`/interview/${Date.now()}`)
  }

  return (
    <Dialog>
      <div className="flex flex-wrap justify-center items-center gap-2 max-w-3xl mx-auto">
        {jobRoleSchema.options.map((option) => (
          <DialogTrigger key={option} onClick={() => {
            form.setValue("jobRole", option);
          }} className="bg-zinc-800 dark:bg-zinc-200 text-zinc-100 dark:text-zinc-900 rounded-md py-3 px-4">
            {option}
          </DialogTrigger>
        ))}
      </div>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start session</DialogTitle>
          <DialogDescription>
            Fill the form below to start a new session
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="jobRole"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Role</FormLabel>
                  <FormControl>
                    <Select form="jobRole" value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="">
                        <SelectValue placeholder="Theme" />
                      </SelectTrigger>
                      <SelectContent>
                        {jobRoleSchema.options.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="yearsOfExperience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Experience</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      placeholder="Years of Experience"
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="skills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skills</FormLabel>
                  <FormControl>
                    <SkillsInput value={field.value || []} onChange={field.onChange} />
                  </FormControl>
                  <FormDescription>
                    Enter at least three skills
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit">Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default SessionInfoForm