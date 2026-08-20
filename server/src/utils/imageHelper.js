export const formatImageString = (image) => {
  if (!image) return null;
  if (image instanceof Uint8Array || Buffer.isBuffer(image)) {
    const str = Buffer.from(image).toString("utf-8");
    if (str.startsWith("data:") || str.startsWith("http") || str.startsWith("/")) {
      return str;
    }
    return `data:image/png;base64,${Buffer.from(image).toString("base64")}`;
  }
  if (typeof image === "string") {
    return image;
  }
  return null;
};

export const formatUserWithImage = (user) => {
  if (!user) return user;
  return {
    ...user,
    image: formatImageString(user.image),
  };
};

export const formatProjectWithImages = (project) => {
  if (!project) return project;
  return {
    ...project,
    creator: project.creator ? formatUserWithImage(project.creator) : project.creator,
    updater: project.updater ? formatUserWithImage(project.updater) : project.updater,
    assignTo: project.assignTo ? formatUserWithImage(project.assignTo) : project.assignTo,
    tasks: Array.isArray(project.tasks)
      ? project.tasks.map((t) => ({
        ...t,
        assignee: t.assignee ? formatUserWithImage(t.assignee) : t.assignee,
        assigner: t.assigner ? formatUserWithImage(t.assigner) : t.assigner,
      }))
      : project.tasks,
  };
};

export const formatTaskWithImages = (task) => {
  if (!task) return task;
  return {
    ...task,
    assignee: task.assignee ? formatUserWithImage(task.assignee) : task.assignee,
    assigner: task.assigner ? formatUserWithImage(task.assigner) : task.assigner,
  };
};
