import { AlertDialog, Button, Description, Label, Surface, Switch, useOverlayState } from "@heroui/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "../../lib/useToast"
import { useEffect, useState } from "react"
import InputText from "../input/InputText"
import SubmitButton from "./SubmitButton"

// Helper function untuk membersihkan data form (mengubah {id, name} menjadi sekadar id)
const normalizePayload = (data) => {
  if (!data || typeof data !== "object") return data;

  const payload = { ...data };

  Object.keys(payload).forEach((key) => {
    const val = payload[key];

    // 1. Jika value berupa Array of Objects, ubah menjadi Array of IDs: [{id: 1}, {id: 2}] -> [1, 2]
    if (Array.isArray(val)) {
        payload[key] = val
        .map((item) => (item && typeof item === "object" && "id" in item ? item.id : item))
        .filter((id) => id !== undefined); // Menghapus item jika ada elemen yang bernilai undefined
    }
    // 2. Jika value berupa Single Object, ambil 'id'-nya saja: {id: 1, name: "A"} -> 1
    else if (val && typeof val === "object" && "id" in val) {
        payload[key] = val.id;
    }
});

  return payload;
};

const NewApprovalButton = ({
  form,
  queryKey,
  submitFn = () => {},
  saveFn = () => {},
  postOnly = false,
  saveOnly = false,
  isCanEdit = false,
  isCanApprove = false,
  noValidationSave = false,
  approvalLabel = "Approve",
  postLabel = "Ajukan",
  onError = () => {},
}) => {
  const save_state = useOverlayState();
  const req_state = useOverlayState();
  const app_state = useOverlayState();

  const toast = useToast();
  const qc = useQueryClient();

  const closeState = () => {
    save_state.close();
    req_state.close();
    app_state.close();
  };

  const [appform, setAppForm] = useState({
    is_decline: false,
    message: "",
  });

  const save_mutation = useMutation({
    mutationFn: saveFn,
    onSuccess: () => {
      toast.success({ message: "Success.", description: "Data telah berhasil disimpan." });
      if (queryKey) {
        qc.invalidateQueries({ queryKey: [...queryKey] });
      }
      closeState();
    },
    onError: (er) => {
      toast.danger({ message: "Gagal", description: er.message });
    },
  });

  const submit_mutation = useMutation({
    mutationFn: submitFn,
    onSuccess: () => {
      setAppForm({ is_decline: false, message: "" });
      if (queryKey) {
        qc.invalidateQueries({ queryKey: [...queryKey] });
      }
      closeState();
    },
    onError: (er) => {
      toast.danger({ message: "Gagal", description: er.message });
      closeState();
    },
  });

  // 🟢 FIX 1: Normalize payload sebelum kirim ke save_mutation
  const handleSaveForm = (dataForm) => {
    const payload = normalizePayload(dataForm);
    save_mutation.mutate(payload);
  };

  // 🟢 FIX 2: Handle Save jika Validation Skip (noValidationSave)
  const errorSave = (errors) => {
    if (noValidationSave) {
      const data = form.getValues();
      const payload = normalizePayload(data);
      save_mutation.mutate(payload);
      return;
    }
    onError(errors);
  };

  const errorSubmit = (errors) => {
    if (noValidationSave) {
      const data = form.getValues();
      const payload = normalizePayload(data);
      submit_mutation.mutate(payload);
      return;
    }
    onError(errors);
  };

  // 🟢 FIX 3: Combine Form Data & Approval State lalu Normalize Payload
  const handleSubmitForm = (dataForm) => {
    const cleanForm = normalizePayload(dataForm);
    const payload = {
      ...cleanForm,
      ...appform,
      is_approve: !appform.is_decline,
    };
    
    submit_mutation.mutate(payload);
  };

  // 🟢 FIX 4: Mencegah infinite update loop pada Switch state
  useEffect(() => {
    if (!appform.is_decline && appform.message !== "") {
      setAppForm((prev) => ({ ...prev, message: "" }));
    }
  }, [appform.is_decline, appform.message]);

  return (
    <div className="flex items-center gap-3">
      {isCanEdit && (
        <>
          {!postOnly && (
            <AlertDialog>
              <Button isDisabled={false} onPress={save_state.setOpen}>
                Simpan
              </Button>
              <AlertDialog.Backdrop isOpen={save_state.isOpen} onOpenChange={save_state.setOpen}>
                <AlertDialog.Container>
                  <AlertDialog.Dialog>
                    <AlertDialog.CloseTrigger />
                    <AlertDialog.Header>
                      <AlertDialog.Icon status="warning" />
                      <AlertDialog.Heading>Simpan</AlertDialog.Heading>
                    </AlertDialog.Header>
                    <AlertDialog.Body>
                      <div>Apakah Anda yakin menyimpan perubahan data ini?</div>
                    </AlertDialog.Body>
                    <AlertDialog.Footer>
                      <Button slot="close" variant="tertiary">
                        Close
                      </Button>
                      <SubmitButton
                        isLoading={save_mutation.isPending}
                        label="Simpan"
                        onPress={form.handleSubmit(handleSaveForm, errorSave)}
                      />
                    </AlertDialog.Footer>
                  </AlertDialog.Dialog>
                </AlertDialog.Container>
              </AlertDialog.Backdrop>
            </AlertDialog>
          )}

          {!saveOnly && !isCanApprove && (
            <AlertDialog>
              <Button isDisabled={false} className="bg-orange-500" onPress={req_state.setOpen}>
                {postLabel}
              </Button>
              <AlertDialog.Backdrop isOpen={req_state.isOpen} onOpenChange={req_state.setOpen}>
                <AlertDialog.Container>
                  <AlertDialog.Dialog>
                    <AlertDialog.CloseTrigger />
                    <AlertDialog.Header>
                      <AlertDialog.Icon status="success" />
                      <AlertDialog.Heading>Pengajuan Approval</AlertDialog.Heading>
                    </AlertDialog.Header>
                    <AlertDialog.Body>
                      <div>
                        Apakah kamu yakin mau mengajukan proses approval ke tahap selanjutnya?
                      </div>
                    </AlertDialog.Body>
                    <AlertDialog.Footer>
                      <Button slot="close" variant="tertiary">
                        Close
                      </Button>
                      <SubmitButton
                        isLoading={submit_mutation.isPending}
                        onPress={form.handleSubmit(handleSubmitForm, errorSubmit)}
                      />
                    </AlertDialog.Footer>
                  </AlertDialog.Dialog>
                </AlertDialog.Container>
              </AlertDialog.Backdrop>
            </AlertDialog>
          )}
        </>
      )}

      {isCanApprove && !saveOnly && (
        <AlertDialog>
          <Button isDisabled={false} className="bg-orange-500" onPress={req_state.setOpen}>
            {approvalLabel}
          </Button>
          <AlertDialog.Backdrop isOpen={req_state.isOpen} onOpenChange={req_state.setOpen}>
            <AlertDialog.Container>
              <AlertDialog.Dialog>
                <AlertDialog.CloseTrigger />
                <AlertDialog.Header>
                  <AlertDialog.Icon status="success" />
                  <AlertDialog.Heading>Approval Process</AlertDialog.Heading>
                </AlertDialog.Header>
                <AlertDialog.Body>
                  <div className="px-1 space-y-3">
                    <p>Konfirmasi persetujuan data penawaran ini.</p>
                    <div>
                      <Switch
                        isSelected={appform.is_decline}
                        onChange={(e) => setAppForm((prev) => ({ ...prev, is_decline: e }))}
                      >
                        <Switch.Content>
                          <Switch.Control className={appform.is_decline ? "bg-danger" : ""}>
                            <Switch.Thumb />
                          </Switch.Control>
                          Decline Approval
                        </Switch.Content>
                        <Description>Tandai jika pengajuan ditolak.</Description>
                      </Switch>
                    </div>
                    {appform.is_decline && (
                      <Surface variant="secondary" className="p-3 rounded-xl mt-4">
                        <InputText
                          value={appform.message}
                          onChange={(e) =>
                            setAppForm((prev) => ({ ...prev, message: e.target.value }))
                          }
                          label="Catatan"
                        />
                      </Surface>
                    )}
                  </div>
                </AlertDialog.Body>
                <AlertDialog.Footer>
                  <Button variant="tertiary" slot="close">
                    Close
                  </Button>
                  <SubmitButton
                    variant={appform.is_decline ? "danger" : "primary"}
                    onPress={form.handleSubmit(handleSubmitForm, errorSubmit)}
                    isLoading={submit_mutation.isPending}
                  />
                </AlertDialog.Footer>
              </AlertDialog.Dialog>
            </AlertDialog.Container>
          </AlertDialog.Backdrop>
        </AlertDialog>
      )}
    </div>
  );
};

export default NewApprovalButton;