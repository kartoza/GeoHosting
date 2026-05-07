import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./styles.scss";

const ENDPOINTS: { key: string; url: string; subject: string }[] = [
  {
    key: "stripe",
    url: "/api/health/stripe/",
    subject: "Stripe payment is not available now",
  },
  {
    key: "paystack",
    url: "/api/health/paystack/",
    subject: "Paystack payment is not available now",
  },
  {
    key: "erp",
    url: "/api/health/erp/",
    subject: "Checkout system is down",
  },
  {
    key: "proxy",
    url: "/api/health/proxy/",
    subject: "Checkout system is down",
  },
  {
    key: "vault",
    url: "/api/health/vault/",
    subject: "Checkout system is down",
  },
];

const HealthBanner: React.FC = () => {
  const location = useLocation();
  const [failedKeys, setFailedKeys] = useState<Set<string>>(new Set());
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setDismissed(false);
    ENDPOINTS.forEach(({ key, url }) => {
      axios
        .get(url)
        .then((res) => {
          setFailedKeys((prev) => {
            const next = new Set(Array.from(prev));
            if (res.data?.status !== "OK") {
              next.add(key);
            } else {
              next.delete(key);
            }
            return next;
          });
        })
        .catch(() => {
          setFailedKeys((prev) => new Set(Array.from(prev).concat(key)));
        });
    });
  }, [location.pathname]);

  if (dismissed || failedKeys.size === 0) return null;

  const subjects = ENDPOINTS
    .filter(({ key }) => failedKeys.has(key))
    .map(({ subject }) => subject)
    .filter((s, i, arr) => arr.indexOf(s) === i);

  const message = subjects.join(", ") + ", please come back later or contact support.";

  return (
    <div className="HealthBanner">
      <div className="HealthBanner__item">
        <span className="HealthBanner__item__message">{message}</span>
        <button
          className="HealthBanner__item__close"
          onClick={() => setDismissed(true)}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default HealthBanner;