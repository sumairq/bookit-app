import { useRouteError, isRouteErrorResponse } from "react-router-dom";

interface Props {
  message?: string;
}

export default function ErrorPage({ message }: Props) {
  const routeError = useRouteError();

  let msg = message;
  if (!msg) {
    if (isRouteErrorResponse(routeError)) {
      msg = routeError.statusText || "Something went wrong.";
    } else if (routeError instanceof Error) {
      msg = routeError.message;
    } else {
      msg = "Something went wrong.";
    }
  }

  return (
    <main className="main">
      <div className="error">
        <div className="error__title">
          <h2 className="heading-secondary heading-secondary--error">
            Uh oh! Something went wrong!
          </h2>
          <h2 className="error__emoji">😢 🤯</h2>
        </div>
        <div className="error__msg">{msg}</div>
      </div>
    </main>
  );
}
