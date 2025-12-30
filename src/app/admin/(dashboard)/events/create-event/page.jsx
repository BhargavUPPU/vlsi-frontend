"use client";
import { AdminFormTemplate } from "@/components/AdminFormTemplate";
import { useCreateEvent, useEvent, useUpdateEvent } from "@/lib/hooks/useAdmin";
import { eventSchema } from "@/lib/validations/admin";
import { useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const eventFields = [
  { name: "title", label: "Event Title", placeholder: "Enter event title", required: true },
  { name: "description", label: "Description", type: "textarea", placeholder: "Enter event description", rows: 4, required: true },
  { name: "eventType", label: "Event Type", placeholder: "Enter event type (optional)" },
  { name: "aboutEvent", label: "About Event", type: "textarea", placeholder: "About the event (optional)", rows: 4 },
  { name: "eventDate", label: "Event Date", type: "datetime-local", required: true },
  { name: "noOfParticipants", label: "Number of Participants", type: "number", placeholder: "Enter number" },
  { name: "eventRegistrationLink", label: "Registration Link", placeholder: "https://..." },
  { name: "eventPdfLink", label: "PDF Link", placeholder: "https://..." },
  { name: "eventVideoLink", label: "Video Link", placeholder: "https://..." },
  { name: "eventHighlights", label: "Event Highlights", type: "array", placeholder: "Add an event highlight" },
  { name: "studentCoordinators", label: "Student Coordinators", type: "array", placeholder: "Add student coordinator name" },
  { name: "facultyCoordinators", label: "Faculty Coordinators", type: "array", placeholder: "Add faculty coordinator name" },
  { name: "speakerName", label: "Speaker Name", placeholder: "Enter speaker name (optional)" },
  { name: "speakerDescription", label: "Speaker Description", type: "textarea", placeholder: "Speaker details (optional)", rows: 4 },
  { name: "speakerHighlights", label: "Speaker Highlights", type: "array", placeholder: "Add a speaker highlight" },
  { name: "eventCertificateImage", label: "Event Certificate Image", type: "image" },
  { name: "eventFiles", label: "Event Photos/Images", type: "multipleImages", maxFiles: 15 },
];

export default function CreateEventPage() {
  const searchParams = useSearchParams();
  const editId = searchParams?.get("edit");
  const isEditing = !!editId;

  console.log('CreateEventPage - editId:', editId);
  console.log('CreateEventPage - isEditing:', isEditing);

  const { data: eventResponse, isLoading: loadingEvent, error: eventError } = useEvent(editId, {
    enabled: isEditing
  });

  // Extract the actual event data from the response
  const event = eventResponse?.data || eventResponse;
  
  console.log('CreateEventPage - eventResponse:', eventResponse);
  console.log('CreateEventPage - event:', event);
  console.log('CreateEventPage - loadingEvent:', loadingEvent);
  console.log('CreateEventPage - eventError:', eventError);

  const createEvent = useCreateEvent({
    successMessage: "Event created successfully"
  });

  const updateEvent = useUpdateEvent({
    successMessage: "Event updated successfully"
  });

  const handleSubmit = async (data) => {
    console.log('handleSubmit - isEditing:', isEditing);
    console.log('handleSubmit - editId:', editId);
    console.log('handleSubmit - data:', data);
    
    if (isEditing) {
      await updateEvent.mutateAsync({ id: editId, data });
    } else {
      await createEvent.mutateAsync(data);
    }
  };

  return (
    <AdminFormTemplate
      title="Event"
      schema={eventSchema}
      defaultValues={event || {}}
      onSubmit={handleSubmit}
      isLoading={loadingEvent}
      isEditing={isEditing}
      backPath="/admin/events"
      fields={eventFields}
    >
      {(form) => (
        <div className="space-y-2">
          <Label>Status *</Label>
          <Select onValueChange={(value) => form.setValue('status', value)} defaultValue={form.getValues('status')}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="ongoing">Ongoing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </AdminFormTemplate>
  );
}