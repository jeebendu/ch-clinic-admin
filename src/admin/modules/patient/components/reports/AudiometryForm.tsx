import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Slider
} from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"

const audiometrySchema = z.object({
  rightAirConduction250: z.string().optional(),
  rightAirConduction500: z.string().optional(),
  rightAirConduction1000: z.string().optional(),
  rightAirConduction2000: z.string().optional(),
  rightAirConduction4000: z.string().optional(),
  rightAirConduction8000: z.string().optional(),
  leftAirConduction250: z.string().optional(),
  leftAirConduction500: z.string().optional(),
  leftAirConduction1000: z.string().optional(),
  leftAirConduction2000: z.string().optional(),
  leftAirConduction4000: z.string().optional(),
  leftAirConduction8000: z.string().optional(),
  rightBoneConduction500: z.string().optional(),
  rightBoneConduction1000: z.string().optional(),
  rightBoneConduction2000: z.string().optional(),
  rightBoneConduction4000: z.string().optional(),
  leftBoneConduction500: z.string().optional(),
  leftBoneConduction1000: z.string().optional(),
  leftBoneConduction2000: z.string().optional(),
  leftBoneConduction4000: z.string().optional(),
  rightMasking500: z.string().optional(),
  rightMasking1000: z.string().optional(),
  rightMasking2000: z.string().optional(),
  rightMasking4000: z.string().optional(),
  leftMasking500: z.string().optional(),
  leftMasking1000: z.string().optional(),
  leftMasking2000: z.string().optional(),
  leftMasking4000: z.string().optional(),
  speechReceptionThresholdRight: z.string().optional(),
  speechReceptionThresholdLeft: z.string().optional(),
  speechDiscriminationScoreRight: z.string().optional(),
  speechDiscriminationScoreLeft: z.string().optional(),
  tympanometryRight: z.string().optional(),
  tympanometryLeft: z.string().optional(),
  reflexesRight: z.string().optional(),
  reflexesLeft: z.string().optional(),
  oaeRight: z.string().optional(),
  oaeLeft: z.string().optional(),
  audiogramInterpretation: z.string().optional(),
  recommendations: z.string().optional(),
  furtherTests: z.string().optional(),
  hearingAidTrial: z.boolean().optional(),
  hearingAidFitting: z.boolean().optional(),
  counselling: z.boolean().optional(),
  otherRecommendations: z.string().optional(),
});

type AudiometryFormValues = z.infer<typeof audiometrySchema>;

interface AudiometryFormProps {
  patient: boolean;
}

const AudiometryForm: React.FC<AudiometryFormProps> = ({ patient }) => {
  const form = useForm<AudiometryFormValues>({
    resolver: zodResolver(audiometrySchema),
    defaultValues: {
      rightAirConduction250: "",
      rightAirConduction500: "",
      rightAirConduction1000: "",
      rightAirConduction2000: "",
      rightAirConduction4000: "",
      rightAirConduction8000: "",
      leftAirConduction250: "",
      leftAirConduction500: "",
      leftAirConduction1000: "",
      leftAirConduction2000: "",
      leftAirConduction4000: "",
      leftAirConduction8000: "",
      rightBoneConduction500: "",
      rightBoneConduction1000: "",
      rightBoneConduction2000: "",
      rightBoneConduction4000: "",
      leftBoneConduction500: "",
      leftBoneConduction1000: "",
      leftBoneConduction2000: "",
      leftBoneConduction4000: "",
      rightMasking500: "",
      rightMasking1000: "",
      rightMasking2000: "",
      rightMasking4000: "",
      leftMasking500: "",
      leftMasking1000: "",
      leftMasking2000: "",
      leftMasking4000: "",
      speechReceptionThresholdRight: "",
      speechReceptionThresholdLeft: "",
      speechDiscriminationScoreRight: "",
      speechDiscriminationScoreLeft: "",
      tympanometryRight: "",
      tympanometryLeft: "",
      reflexesRight: "",
      reflexesLeft: "",
      oaeRight: "",
      oaeLeft: "",
      audiogramInterpretation: "",
      recommendations: "",
      furtherTests: "",
      hearingAidTrial: false,
      hearingAidFitting: false,
      counselling: false,
      otherRecommendations: "",
    },
  });

  function onSubmit(values: AudiometryFormValues) {
    console.log("Form values:", values);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Audiometry Report Form</CardTitle>
        <CardDescription>Enter the details for the audiometry report.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Air Conduction Section */}
            <div>
              <h3 className="text-lg font-semibold">Air Conduction</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Right Ear */}
                <div>
                  <h4 className="font-medium">Right Ear</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <FormField
                      control={form.control}
                      name="rightAirConduction250"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>250 Hz</FormLabel>
                          <FormControl>
                            <Input placeholder="Value" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="rightAirConduction500"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>500 Hz</FormLabel>
                          <FormControl>
                            <Input placeholder="Value" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="rightAirConduction1000"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>1000 Hz</FormLabel>
                          <FormControl>
                            <Input placeholder="Value" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="rightAirConduction2000"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>2000 Hz</FormLabel>
                          <FormControl>
                            <Input placeholder="Value" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="rightAirConduction4000"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>4000 Hz</FormLabel>
                          <FormControl>
                            <Input placeholder="Value" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="rightAirConduction8000"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>8000 Hz</FormLabel>
                          <FormControl>
                            <Input placeholder="Value" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Left Ear */}
                <div>
                  <h4 className="font-medium">Left Ear</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <FormField
                      control={form.control}
                      name="leftAirConduction250"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>250 Hz</FormLabel>
                          <FormControl>
                            <Input placeholder="Value" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="leftAirConduction500"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>500 Hz</FormLabel>
                          <FormControl>
                            <Input placeholder="Value" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="leftAirConduction1000"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>1000 Hz</FormLabel>
                          <FormControl>
                            <Input placeholder="Value" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="leftAirConduction2000"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>2000 Hz</FormLabel>
                          <FormControl>
                            <Input placeholder="Value" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="leftAirConduction4000"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>4000 Hz</FormLabel>
                          <FormControl>
                            <Input placeholder="Value" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="leftAirConduction8000"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>8000 Hz</FormLabel>
                          <FormControl>
                            <Input placeholder="Value" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bone Conduction Section */}
            <div>
              <h3 className="text-lg font-semibold">Bone Conduction</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Right Ear */}
                <div>
                  <h4 className="font-medium">Right Ear</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <FormField
                      control={form.control}
                      name="rightBoneConduction500"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>500 Hz</FormLabel>
                          <FormControl>
                            <Input placeholder="Value" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="rightBoneConduction1000"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>1000 Hz</FormLabel>
                          <FormControl>
                            <Input placeholder="Value" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="rightBoneConduction2000"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>2000 Hz</FormLabel>
                          <FormControl>
                            <Input placeholder="Value" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="rightBoneConduction4000"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>4000 Hz</FormLabel>
                          <FormControl>
                            <Input placeholder="Value" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Left Ear */}
                <div>
                  <h4 className="font-medium">Left Ear</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <FormField
                      control={form.control}
                      name="leftBoneConduction500"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>500 Hz</FormLabel>
                          <FormControl>
                            <Input placeholder="Value" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="leftBoneConduction1000"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>1000 Hz</FormLabel>
                          <FormControl>
                            <Input placeholder="Value" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="leftBoneConduction2000"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>2000 Hz</FormLabel>
                          <FormControl>
                            <Input placeholder="Value" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="leftBoneConduction4000"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>4000 Hz</FormLabel>
                          <FormControl>
                            <Input placeholder="Value" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Masking Section */}
            <div>
              <h3 className="text-lg font-semibold">Masking</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Right Ear */}
                <div>
                  <h4 className="font-medium">Right Ear</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <FormField
                      control={form.control}
                      name="rightMasking500"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>500 Hz</FormLabel>
                          <FormControl>
                            <Input placeholder="Value" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="rightMasking1000"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>1000 Hz</FormLabel>
                          <FormControl>
                            <Input placeholder="Value" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="rightMasking2000"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>2000 Hz</FormLabel>
                          <FormControl>
                            <Input placeholder="Value" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="rightMasking4000"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>4000 Hz</FormLabel>
                          <FormControl>
                            <Input placeholder="Value" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Left Ear */}
                <div>
                  <h4 className="font-medium">Left Ear</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <FormField
                      control={form.control}
                      name="leftMasking500"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>500 Hz</FormLabel>
                          <FormControl>
                            <Input placeholder="Value" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="leftMasking1000"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>1000 Hz</FormLabel>
                          <FormControl>
                            <Input placeholder="Value" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="leftMasking2000"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>2000 Hz</FormLabel>
                          <FormControl>
                            <Input placeholder="Value" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="leftMasking4000"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>4000 Hz</FormLabel>
                          <FormControl>
                            <Input placeholder="Value" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Speech Audiometry Section */}
            <div>
              <h3 className="text-lg font-semibold">Speech Audiometry</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="speechReceptionThresholdRight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Speech Reception Threshold (Right)</FormLabel>
                      <FormControl>
                        <Input placeholder="Value" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="speechReceptionThresholdLeft"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Speech Reception Threshold (Left)</FormLabel>
                      <FormControl>
                        <Input placeholder="Value" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="speechDiscriminationScoreRight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Speech Discrimination Score (Right)</FormLabel>
                      <FormControl>
                        <Input placeholder="Value" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="speechDiscriminationScoreLeft"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Speech Discrimination Score (Left)</FormLabel>
                      <FormControl>
                        <Input placeholder="Value" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Impedance Audiometry Section */}
            <div>
              <h3 className="text-lg font-semibold">Impedance Audiometry</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="tympanometryRight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tympanometry (Right)</FormLabel>
                      <FormControl>
                        <Input placeholder="Value" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tympanometryLeft"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tympanometry (Left)</FormLabel>
                      <FormControl>
                        <Input placeholder="Value" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="reflexesRight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reflexes (Right)</FormLabel>
                      <FormControl>
                        <Input placeholder="Value" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="reflexesLeft"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reflexes (Left)</FormLabel>
                      <FormControl>
                        <Input placeholder="Value" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* OAE Section */}
            <div>
              <h3 className="text-lg font-semibold">Otoacoustic Emissions (OAE)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="oaeRight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>OAE (Right)</FormLabel>
                      <FormControl>
                        <Input placeholder="Value" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="oaeLeft"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>OAE (Left)</FormLabel>
                      <FormControl>
                        <Input placeholder="Value" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Interpretation and Recommendations Section */}
            <div>
              <h3 className="text-lg font-semibold">Interpretation and Recommendations</h3>
              <FormField
                control={form.control}
                name="audiogramInterpretation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Audiogram Interpretation</FormLabel>
                    <FormControl>
                      <Input placeholder="Interpretation" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="recommendations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recommendations</FormLabel>
                    <FormControl>
                      <Input placeholder="Recommendations" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="furtherTests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Further Tests</FormLabel>
                    <FormControl>
                      <Input placeholder="Further Tests" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Additional Recommendations Section */}
            <div>
              <h3 className="text-lg font-semibold">Additional Recommendations</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="hearingAidTrial"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">Hearing Aid Trial</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="hearingAidFitting"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">Hearing Aid Fitting</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="counselling"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">Counselling</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="otherRecommendations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Other Recommendations</FormLabel>
                    <FormControl>
                      <Input placeholder="Other Recommendations" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AudiometryForm;
