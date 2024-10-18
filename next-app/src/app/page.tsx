import TaskPage from "./components/tasks/main";

export default function Home() {
  return (
    <main className="flex flex-col gap-8 w-full justify-center items-center ">
      <div className="w-[60rem]">
        <TaskPage></TaskPage>
      </div>
    </main>
  );
}
