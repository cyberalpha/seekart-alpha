
import { useState } from "react";
import { EventFormData } from "@/types/event";

export const useEventForm = (initialData: Partial<EventFormData> = {}) => {
  const [title, setTitle] = useState(initialData.title || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [date, setDate] = useState(initialData.date || "");
  const [address, setAddress] = useState(initialData.address || "");
  const [city, setCity] = useState(initialData.city || "");
  const [crossStreets, setCrossStreets] = useState(initialData.cross_streets || "");
  const [locality, setLocality] = useState(initialData.locality || "");
  const [selectedArtTypes, setSelectedArtTypes] = useState<string[]>(initialData.art_types || []);
  const [ticketUrl, setTicketUrl] = useState(initialData.ticket_url || "");
  const [videoUrl, setVideoUrl] = useState(initialData.video_url || "");
  const [imageUrl, setImageUrl] = useState(initialData.image_url || "");
  const [latitude, setLatitude] = useState(initialData.latitude || "");
  const [longitude, setLongitude] = useState(initialData.longitude || "");

  const formState = {
    title,
    description,
    date,
    address,
    city,
    cross_streets: crossStreets,
    locality,
    type: selectedArtTypes[0] || "",
    art_types: selectedArtTypes,
    ticket_url: ticketUrl,
    video_url: videoUrl,
    image_url: imageUrl,
    latitude,
    longitude
  };

  const formSetters = {
    setTitle,
    setDescription,
    setDate,
    setAddress,
    setCity,
    setCrossStreets,
    setLocality,
    setSelectedArtTypes,
    setTicketUrl,
    setVideoUrl,
    setImageUrl,
    setLatitude,
    setLongitude
  };

  return { formState, formSetters };
};
