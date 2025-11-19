// src/pages/AdminEstimates.tsx
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { api, setAuthToken } from "../api";

interface Cake {
  id: number;
  name: string;
  price: number;
}

interface CakeOption {
  id: number;
  cakeId: number;
  optionName: string;
  price: number;
}

const AdminEstimates: React.FC = () => {
  const navigate = useNavigate();
  const currentUsername = localStorage.getItem("adminUsername");

  const [cakes, setCakes] = React.useState<Cake[]>([]);
  const [selectedCakeId, setSelectedCakeId] = React.useState<number | null>(null);

  const [options, setOptions] = React.useState<CakeOption[]>([]);
  const [selectedOptionIds, setSelectedOptionIds] = React.useState<number[]>([]);

  const [quantity, setQuantity] = React.useState(1);
  const [customerName, setCustomerName] = React.useState("");
  const [memo, setMemo] = React.useState("");

  const [loadingCakes, setLoadingCakes] = React.useState(true);
  const [loadingOptions, setLoadingOptions] = React.useState(false);
  const [err, setErr] = React.useState("");

  const handleAuthError = (status?: number) => {
    if (status === 401) {
      setAuthToken(null);
      localStorage.removeItem("adminUsername");
      navigate("/login");
    }
  };

  const handleLogout = () => {
    setAuthToken(null);
    localStorage.removeItem("adminUsername");
    navigate("/login");
  };

  // 케이크 목록 로드
  React.useEffect(() => {
    setLoadingCakes(true);
    api
      .get<Cake[]>("/api/cakes")
      .then((r) => {
        setCakes(r.data);
        if (r.data.length > 0) {
          setSelectedCakeId(r.data[0].id);
        }
        setErr("");
      })
      .catch((error) => {
        console.error("load cakes error:", error);
        handleAuthError(error.response?.status);
        setErr("케이크 목록을 불러오지 못했습니다.");
      })
      .finally(() => setLoadingCakes(false));
  }, []);

  // 선택된 케이크의 옵션 목록 로드
  React.useEffect(() => {
    if (selectedCakeId == null) {
      setOptions([]);
      setSelectedOptionIds([]);
      return;
    }

    setLoadingOptions(true);
    api
      .get<CakeOption[]>(`/api/cakes/${selectedCakeId}/options`)
      .then((r) => {
        setOptions(r.data);
        setSelectedOptionIds([]);
        setErr("");
      })
      .catch((error) => {
        console.error("load options error:", error);
        handleAuthError(error.response?.status);
        setErr("옵션 목록을 불러오지 못했습니다.");
      })
      .finally(() => setLoadingOptions(false));
  }, [selectedCakeId]);

  const selectedCake = cakes.find((c) => c.id === selectedCakeId) || null;

  // 옵션 선택 토글
  const toggleOption = (id: number) => {
    setSelectedOptionIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // 수량 변경
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseInt(e.target.value, 10);
    if (Number.isNaN(v) || v <= 0) {
      setQuantity(1);
    } else {
      setQuantity(v);
    }
  };

  // 가격 계산
  const basePrice = selectedCake?.price ?? 0;
  const optionsTotal = options
    .filter((o) => selectedOptionIds.includes(o.id))
    .reduce((sum, o) => sum + o.price, 0);
  const unitPrice = basePrice + optionsTotal;
  const totalPrice = unitPrice * (quantity || 0);

  // 지금은 API로 저장 안 하고, 나중에 /api/estimates 생기면 여기서 호출
  const handleCreateEstimate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCake) {
      setErr("먼저 케이크를 선택해주세요.");
      return;
    }
    if (!customerName.trim()) {
      setErr("고객 이름(또는 메모)을 입력해주세요.");
      return;
    }

    setErr("");
    console.log("견적 생성(임시):", {
      cake: selectedCake,
      selectedOptionIds,
      quantity,
      customerName,
      memo,
      unitPrice,
      totalPrice,
    });
    alert("지금은 계산만 하고 있습니다. 나중에 DB에 저장하는 API를 연결할 수 있어요.");
  };

  return (
    <div style={{ maxWidth: 960, margin: "32px auto", fontFamily: "system-ui" }}>
      {/* 상단 바 */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
          <div style={{ fontSize: 14, color: "#6b7280" }}>Estimate API</div>
          <h1 style={{ fontSize: 20, margin: 0 }}>케이크 견적 생성</h1>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {currentUsername && (
            <span style={{ fontSize: 14, color: "#4b5563" }}>
              {currentUsername} 님
            </span>
          )}
          <button
            onClick={handleLogout}
            style={{
              padding: "6px 12px",
              fontSize: 13,
              borderRadius: 999,
              border: "1px solid #e5e7eb",
              background: "white",
              cursor: "pointer",
            }}
          >
            로그아웃
          </button>
        </div>
      </header>

      {err && (
        <p style={{ color: "crimson", fontSize: 13, marginBottom: 12 }}>{err}</p>
      )}

      {/* 1. 케이크 선택 */}
      <section
        style={{
          marginBottom: 24,
          padding: 16,
          borderRadius: 12,
          border: "1px solid #e5e7eb",
          background: "white",
        }}
      >
        <h2 style={{ fontSize: 16, marginTop: 0, marginBottom: 12 }}>
          1. 케이크 선택
        </h2>

        {loadingCakes ? (
          <p style={{ fontSize: 13, color: "#6b7280" }}>케이크 목록 불러오는 중...</p>
        ) : cakes.length === 0 ? (
          <p style={{ fontSize: 13, color: "#6b7280" }}>
            등록된 케이크가 없습니다. 먼저 케이크를 추가해주세요.
          </p>
        ) : (
          <select
            value={selectedCakeId ?? ""}
            onChange={(e) =>
              setSelectedCakeId(
                e.target.value ? parseInt(e.target.value, 10) : null
              )
            }
            style={{
              padding: 8,
              fontSize: 13,
              borderRadius: 8,
              border: "1px solid #d1d5db",
            }}
          >
            {cakes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.price.toLocaleString()} 원)
              </option>
            ))}
          </select>
        )}
      </section>

      {/* 2. 옵션 선택 */}
      <section
        style={{
          marginBottom: 24,
          padding: 16,
          borderRadius: 12,
          border: "1px solid #e5e7eb",
          background: "white",
        }}
      >
        <h2 style={{ fontSize: 16, marginTop: 0, marginBottom: 12 }}>
          2. 옵션 선택
        </h2>

        {loadingOptions ? (
          <p style={{ fontSize: 13, color: "#6b7280" }}>옵션 불러오는 중...</p>
        ) : options.length === 0 ? (
          <p style={{ fontSize: 13, color: "#6b7280" }}>
            이 케이크에 등록된 옵션이 없습니다.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {options.map((o) => (
              <label
                key={o.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: 13,
                }}
              >
                <span>
                  <input
                    type="checkbox"
                    checked={selectedOptionIds.includes(o.id)}
                    onChange={() => toggleOption(o.id)}
                    style={{ marginRight: 8 }}
                  />
                  {o.optionName}
                </span>
                <span>{o.price.toLocaleString()} 원</span>
              </label>
            ))}
          </div>
        )}
      </section>

      {/* 3. 수량/고객 정보 + 요약 */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: 16,
          alignItems: "flex-start",
        }}
      >
        <form
          onSubmit={handleCreateEstimate}
          style={{
            padding: 16,
            borderRadius: 12,
            border: "1px solid #e5e7eb",
            background: "white",
          }}
        >
          <h2 style={{ fontSize: 16, marginTop: 0, marginBottom: 12 }}>
            3. 고객 정보 / 비고
          </h2>

          <div style={{ marginBottom: 12 }}>
            <label
              style={{ display: "block", fontSize: 13, marginBottom: 4 }}
            >
              고객명 / 주문자
            </label>
            <input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="예: 홍길동 / 인스타 @xxxx"
              style={{
                width: "100%",
                padding: 8,
                fontSize: 13,
                borderRadius: 8,
                border: "1px solid #d1d5db",
              }}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label
              style={{ display: "block", fontSize: 13, marginBottom: 4 }}
            >
              수량
            </label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={handleQuantityChange}
              style={{
                width: 120,
                padding: 8,
                fontSize: 13,
                borderRadius: 8,
                border: "1px solid #d1d5db",
              }}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label
              style={{ display: "block", fontSize: 13, marginBottom: 4 }}
            >
              메모
            </label>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              rows={3}
              placeholder="요청사항, 픽업 시간 등"
              style={{
                width: "100%",
                padding: 8,
                fontSize: 13,
                borderRadius: 8,
                border: "1px solid #d1d5db",
                resize: "vertical",
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              marginTop: 8,
              padding: "8px 12px",
              fontSize: 14,
              borderRadius: 999,
              border: "none",
              background: "#4f46e5",
              color: "white",
              cursor: "pointer",
            }}
          >
            견적 생성 (임시)
          </button>
        </form>

        {/* 우측 요약 카드 */}
        <div
          style={{
            padding: 16,
            borderRadius: 12,
            border: "1px solid #e5e7eb",
            background: "white",
          }}
        >
          <h2 style={{ fontSize: 16, marginTop: 0, marginBottom: 12 }}>
            견적 요약
          </h2>

          <div style={{ fontSize: 13, marginBottom: 8 }}>
            <div style={{ marginBottom: 4 }}>
              <strong>케이크:</strong>{" "}
              {selectedCake ? selectedCake.name : "선택 없음"}
            </div>
            <div style={{ marginBottom: 4 }}>
              <strong>기본 가격:</strong>{" "}
              {basePrice.toLocaleString()} 원
            </div>
            <div style={{ marginBottom: 4 }}>
              <strong>옵션 합계:</strong>{" "}
              {optionsTotal.toLocaleString()} 원
            </div>
            <div style={{ marginBottom: 4 }}>
              <strong>1개당 금액:</strong>{" "}
              {unitPrice.toLocaleString()} 원
            </div>
            <div style={{ marginTop: 8, fontSize: 15 }}>
              <strong>총 {quantity}개 = {totalPrice.toLocaleString()} 원</strong>
            </div>
          </div>

          <hr style={{ border: 0, borderTop: "1px solid #e5e7eb", margin: "12px 0" }} />

          <div style={{ fontSize: 12, color: "#6b7280" }}>
            이 화면은 현재 계산용 임시 화면입니다.
            나중에 /api/estimates 같은 엔드포인트가 준비되면
            여기서 실제로 견적서를 생성하고 저장하도록 연결할 수 있습니다.
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminEstimates;
