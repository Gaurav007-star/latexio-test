import React from "react";
import { PiCheckCircleFill as Check } from "react-icons/pi";
import { Button } from "../ui/button";

const pricingPlans = [
  {
    plan: "Free LaTeXio ",
    active: true,
    price: { monthly: "$0", yearly: "$0" },
    collaborators: "1 per project",
    projects: "Unlimited",
    compileTimeout: "Basic",
    compileServers: "Fast",
    features: {
      readyTemplates: true,
      trackChanges: false,
      documentHistory: false,
      referenceSearch: false,
      symbolPalette: false,
      git: false,
      github: false,
      dropbox: false,
      papers: false,
      zotero: false,
      mendeley: false,
      prioritySupport: false
    }
  },
  {
    plan: "Small Business",
    active: false,
    price: { monthly: "$8", yearly: "$90" },
    collaborators: "10 per project",
    projects: "Unlimited",
    compileTimeout: "24×Basic",
    compileServers: "Fast",
    features: {
      readyTemplates: true,
      trackChanges: true,
      documentHistory: true,
      referenceSearch: true,
      symbolPalette: true,
      git: true,
      github: true,
      dropbox: true,
      papers: true,
      zotero: true,
      mendeley: true,
      prioritySupport: true
    }
  },
  {
    plan: "Organizations",
    active: false,
    price: { monthly: "$15", yearly: "$160" },
    collaborators: "Unlimited",
    projects: "Unlimited",
    compileTimeout: "24×Basic",
    compileServers: "Fast",
    features: {
      readyTemplates: true,
      trackChanges: true,
      documentHistory: true,
      referenceSearch: true,
      symbolPalette: true,
      git: true,
      github: true,
      dropbox: true,
      papers: true,
      zotero: true,
      mendeley: true,
      prioritySupport: true
    }
  }
];

const featureLabels = {
  readyTemplates: "Ready-to-use templates",
  trackChanges: "Real-time track changes",
  documentHistory: "Full document history",
  referenceSearch: "Advanced reference search",
  symbolPalette: "Symbol palette",
  git: "Git",
  github: "GitHub",
  dropbox: "Dropbox",
  papers: "Papers",
  zotero: "Zotero",
  mendeley: "Mendeley",
  prioritySupport: "Priority support"
};

const PriceTable = ({ subscription }) => {
  return (
    <div className="table-wrapper w-full h-max flex items-center justify-center px-[10vh] max-[1025px]:px-5 mb-20">
      <div className="overflow-x-auto w-full p-4">
        <table className="table-auto w-full">
          {/* comment:popular-button-section */}
          <thead>
            <tr className="text-left">
              <th className="p-2"></th>
              <th></th>
              <th className="text-center mb-2">
                <Button
                  className={`w-full h-[45px] text-[20px] font-semibold mb-2`}
                >
                  Popular
                </Button>
              </th>
              <th></th>
            </tr>
          </thead>

          <thead>
            <tr className="text-left">
              <th className="p-2"></th>
              {pricingPlans.map((plan) => (
                <th key={plan.plan} className="p-2 text-center">
                  <div className="text-[20px] font-semibold mb-2">
                    {plan.plan}
                  </div>
                  <div className="text-primary font-semibold text-[32px] mb-4">
                    {subscription.monthly ? plan.price.monthly : plan.price.yearly}
                  </div>
                  <Button
                    className={`w-[200px] h-[40px] rounded-full mb-8 hover:scale-105 ${
                      plan.active
                        ? "bg-white border-secondary border-[1px] text-secondary hover:bg-transparent"
                        : ""
                    }`}
                  >
                    {plan.active ? "Active" : "Upgrade"}
                  </Button>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            <tr className="text-[18px] font-medium bg-slate-100">
              <td className="p-2">Number of collaborators</td>
              {pricingPlans.map((plan) => (
                <td
                  key={plan.plan + "-collab"}
                  className="p-2 text-center text-[18px]"
                >
                  {plan.collaborators}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-2 text-[18px] font-medium">
                Number of projects
              </td>
              {pricingPlans.map((plan) => (
                <td
                  key={plan.plan + "-projects"}
                  className="p-2 text-center text-[18px] font-medium"
                >
                  {plan.projects}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-2 bg-gray-100 text-[18px] font-medium">
                Compile timeout
              </td>
              {pricingPlans.map((plan) => (
                <td
                  key={plan.plan + "-timeout"}
                  className="p-2 bg-gray-100 text-center text-[18px] font-medium"
                >
                  {plan.compileTimeout}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-2 text-[18px] font-medium">Compile servers</td>
              {pricingPlans.map((plan) => (
                <td
                  key={plan.plan + "-servers"}
                  className="p-2 text-center text-[18px] font-medium"
                >
                  {plan.compileServers}
                </td>
              ))}
            </tr>

            {/* Editing & Collaboration Features */}
            <tr className="font-bold">
              <td className="p-2 text-[24px]" colSpan={pricingPlans.length + 1}>
                Editing and collaboration
              </td>
            </tr>
            {Object.entries(featureLabels)
              .slice(0, 5)
              .map(([key, label], i) => (
                <tr key={key}>
                  <td
                    className={`p-2 font-medium text-[18px] ${
                      i % 2 == 0 ? "bg-gray-100" : ""
                    }`}
                  >
                    {label}
                  </td>
                  {pricingPlans.map((plan) => (
                    <td
                      key={plan.plan + "-" + key}
                      className={`text-center font-medium text-[18px] ${
                        i % 2 == 0 ? "bg-gray-100" : ""
                      }`}
                    >
                      {plan.features[key] && (
                        <Check className="text-orange-500 inline-block w-7 h-7" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}

            {/* Integration Features */}
            <tr className=" font-bold">
              <td className="p-2 text-[24px]" colSpan={pricingPlans.length + 1}>
                Integrations
              </td>
            </tr>
            {Object.entries(featureLabels)
              .slice(5, 11)
              .map(([key, label], i) => (
                <tr key={key}>
                  <td
                    className={`p-2 text-[18px] font-medium ${
                      i % 2 == 0 ? "bg-gray-100" : ""
                    }`}
                  >
                    {label}
                  </td>
                  {pricingPlans.map((plan) => (
                    <td
                      key={plan.plan + "-" + key}
                      className={`text-center text-[18px] font-medium ${
                        i % 2 == 0 ? "bg-gray-100" : ""
                      }`}
                    >
                      {plan.features[key] && (
                        <Check className="text-orange-500 inline-block w-7 h-7" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}

            {/* Support */}
            <tr className=" font-bold">
              <td className="p-2 text-[24px]" colSpan={pricingPlans.length + 1}>
                Support
              </td>
            </tr>
            <tr className="bg-gray-100">
              <td className="p-2 text-[18px] font-medium">
                {featureLabels.prioritySupport}
              </td>
              {pricingPlans.map((plan) => (
                <td
                  key={plan.plan + "-support"}
                  className="text-center text-[18px] font-medium"
                >
                  {plan.features.prioritySupport && (
                    <Check className="text-orange-500 inline-block w-7 h-7" />
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PriceTable;
