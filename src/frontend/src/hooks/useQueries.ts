import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type AdmissionForm,
  ApplicationStatus,
  type Class,
  type Student,
} from "../backend";
import { useActor } from "./useActor";

export function useRegisterStudent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      _class,
      name,
      email,
      password,
    }: {
      _class: Class;
      name: string;
      email: string;
      password: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.registerStudent(_class, name, email, password);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
}

export function useLoginStudent() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: { email: string; password: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.loginStudent(email, password);
    },
  });
}

export function useGetCallerStudent() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Student | null>({
    queryKey: ["callerStudent"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerStudent();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useSaveDraft() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      email,
      form,
    }: { email: string; form: AdmissionForm }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveDraft(email, form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["callerStudent"] });
    },
  });
}

export function useSubmitForm() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      email,
      form,
    }: { email: string; form: AdmissionForm }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.submitForm(email, form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["callerStudent"] });
    },
  });
}

export function useGetAllApplications() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Student[]>({
    queryKey: ["allApplications"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getAllApplications();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useApproveApplication() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (email: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.approveApplication(email);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allApplications"] });
    },
  });
}

export function useRejectApplication() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (email: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.rejectApplication(email);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allApplications"] });
    },
  });
}

export function useGetApplicationStatus() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (email: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.getApplicationStatus(email);
    },
  });
}
