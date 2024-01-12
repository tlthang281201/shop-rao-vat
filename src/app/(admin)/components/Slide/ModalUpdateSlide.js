import { supabaseAdmin } from "@/supabase/supabase-config";
import upLoadImage from "@/utilities/UpSlide";
import {
  Button,
  FileInput,
  Label,
  Modal,
  TextInput,
  Textarea,
} from "flowbite-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const ModalUpdateSlide = ({ openModal, setOpenModal, fetchData, data }) => {
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [description, setDescription] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const fileName = await upLoadImage(file);
      setFileName(fileName);
      console.log(fileName);
    }
  };

  const deleteImage = async (e) => {
    setImage(null);
    setFileName(null);
    const res = await supabaseAdmin.storage
      .from("post_images")
      .remove([`slides/${fileName}`]);
    console.log(res);
  };
  const handleSubmit = async () => {
    const { error } = await supabaseAdmin
      .from("slides")
      .update({
        url: fileName
          ? `https://weeevlktjgkhinnqsmai.supabase.co/storage/v1/object/public/post_images/slides/${fileName}`
          : data.url,
        description: description,
        updated_at: new Date(),
      })
      .eq("id", data.id);
    if (!error) {
      fetchData();
      setImage(null);
      toast.success("Cập nhập thành công thành công");
    }
    if (error) {
      setImage(null);
      toast.error(`Cập nhập thất bại, lỗi ${error.message}`);
    }
    setDescription(null);
    setOpenModal(false);
    setFileName(null);
  };

  useEffect(() => {
    setDescription(data?.description);
  }, [data]);
  return (
    <Modal
      style={{ zIndex: 99999 }}
      show={openModal}
      onClose={() => {
        setOpenModal(false);
        setImage(null);
        setFileName(null);
      }}
    >
      <Modal.Header>Cập nhập slide</Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          <div>
            <div className="flex w-full items-center flex-row justify-between">
              <Label>Chọn slide</Label>
              <Label
                htmlFor="dropzone-file"
                style={{
                  border: "1px solid black",
                  fontWeight: "bold",
                  borderRadius: "10px",
                  backgroundColor: "#FF5757",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                }}
                className="flex flex-row items-center p-2 gap-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                  />
                </svg>
                <span>Chọn hình ảnh</span>
                <FileInput
                  onChange={handleFileChange}
                  id="dropzone-file"
                  accept="image/*"
                  className="hidden"
                />
              </Label>
            </div>
          </div>
          {image ? (
            <div style={{ position: "relative" }}>
              <Label style={{ color: "black" }}>Xem trước:</Label>
              <Image
                priority={true}
                src={URL.createObjectURL(image)}
                width={100}
                height={100}
                alt="Selected"
                style={{ width: "100%", height: "100%" }}
              />
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  cursor: "pointer",
                }}
                onClick={() => deleteImage()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>
          ) : (
            <div style={{ position: "relative" }}>
              <Label style={{ color: "black" }}>Xem trước:</Label>
              <Image
                priority={true}
                src={data?.url}
                width={400}
                height={200}
                alt="Selected"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          )}
          <div>
            <div className="mb-2 block">
              <Label htmlFor="des" value="Mô tả" />
            </div>
            <Textarea
              id="des"
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả.."
              rows={4}
              value={description}
            />
          </div>

          <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-300">
            <Button
              onClick={() => {
                handleSubmit();
              }}
              color="success"
            >
              Cập nhập
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalUpdateSlide;
