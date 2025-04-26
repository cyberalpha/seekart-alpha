
export type EventFormData = {
  title: string;
  description: string;
  date: string;
  address: string;
  city: string;
  state: string;
  country: string;
  cross_street_1: string;
  cross_street_2: string;
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

export type EventType = {
  id: string;
  title: string;
  description: string | null;
  date: string;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  cross_street_1: string | null;
  cross_street_2: string | null;
  locality: string | null;
  type: string;
  art_types: string[] | null;
  ticket_url: string | null;
  video_url: string | null;
  image_url: string;
  latitude: number;
  longitude: number;
  artist_id: string;
  created_at: string;
  updated_at: string;
  followers?: number;
  follower_count?: number;
  artists?: {
    name: string;
    profile_image: string | null;
  };
};
