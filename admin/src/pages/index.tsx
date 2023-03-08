import PageLayout from "@/components/PageLayout";
import Section from "@/components/Section";
import { classNames } from "@/utils/css";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/20/solid";

const stats = [
  {
    name: "Tag Rate",
    stat: "45",
    previousStat: "50",
    change: "95%",
    changeType: "increase",
  },
  {
    name: "Guests inside",
    stat: "190",
    previousStat: "215",
    change: "90%",
    changeType: "increase",
  },
  {
    name: "Total entries",
    stat: "405",
    previousStat: "405",
    change: "100%",
    changeType: "increase",
  },
];

export default function Example() {
  return (
    <PageLayout>
      <div>
        <Section title="Dashboard" description="This is the dashboard. Here you can find high-level information on the state of your guest registration." />
        <dl className="mt-5 grid grid-cols-1 divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow md:grid-cols-3 md:divide-y-0 md:divide-x">
          {stats.map((item) => (
            <div key={item.name} className="px-4 py-5 sm:p-6">
              <dt className="text-base font-normal text-gray-900">
                {item.name}
              </dt>
              <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
                <div className="flex items-baseline text-2xl font-semibold text-indigo-600">
                  {item.stat}
                  <span className="ml-2 text-sm font-medium text-gray-500">
                    from {item.previousStat}
                  </span>
                </div>

                <div
                  className={classNames(
                    item.changeType === "increase"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800",
                    "inline-flex items-baseline px-2.5 py-0.5 rounded-full text-sm font-medium md:mt-2 lg:mt-0"
                  )}
                >
                  {item.changeType === "increase" ? (
                    <ArrowUpIcon
                      className="-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center text-green-500"
                      aria-hidden="true"
                    />
                  ) : (
                    <ArrowDownIcon
                      className="-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center text-red-500"
                      aria-hidden="true"
                    />
                  )}

                  <span className="sr-only">
                    {" "}
                    {item.changeType === "increase"
                      ? "Increased"
                      : "Decreased"}{" "}
                    by{" "}
                  </span>
                  {item.change}
                </div>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </PageLayout>
  );
}
