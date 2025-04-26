
export type EventFormData = {
  title: string;
  description: string;
  date: string;
  address: string;
  city: string;
  cross_streets: string;
  locality: string;
  type: string;
  art_types: string[];
  ticket_url: string;
  video_url: string;
  image_url: string;
  latitude: string;
  longitude: string;
};

export type EventFormProps = {
  initialData?: Partial<EventFormData>;
  onSubmit: (data: EventFormData) => Promise<void>;
  submitButtonText: string;
  onCancel: () => void;
  loading: boolean;
  uploading: boolean;
};
