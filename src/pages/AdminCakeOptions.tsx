// src/pages/AdminCakeOptions.tsx
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

const AdminCakeOptions: React.FC = () => {
  const [cakes, setCakes] = React.useState<Cake[]>([]);
  const [selectedCakeId, setSelectedCakeId] = React.useState<number | null>(null);

  const [options, setOptions] = React.useState<CakeOption[]>([]);
  const [newName, setNewName] = React.useState("");
  const [newPrice, setNewPrice] = React.useState("");

  const [loadingCakes, setLoadingCakes] = React.useState(true);
  const [loadingOptions, setLoadingOptions] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [err, setErr] = React.useState("");

  const navigate = useNavigate();
  const currentUsername = localStorage.getItem("adminUsername");

  const handleAuthError = (status?: number) => {
    if (status === 401) {
      setAuthToken(null);
      localStorage.removeItem("adminUsername");
      navigate("/login");
    }
  };

  // 케이크 목록 로드
  const loadCakes = React.useCallback(() => {
    setLoadingCakes(true);
    api
      .get<Cake[]>("/api/cakes")
      .then((r) => {
        setCakes(r.data);
        if (r.data.length > 0 && selectedCakeId == null) {
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
  }, [selectedCakeId, navigate]);

  // 특정 케이크 옵션 목록 로드
  const loadOptions = React.useCallback(
    (cakeId: number) => {
      setLoadingOptions(true);
      api
        .get<CakeOption[]>(`/api/cakes/${cakeId}/options`)
        .then((r) => {
          setOptions(r.data);
          setErr("");
        })
        .catch((error) => {
          console.error("load options error:", error);
          handleAuthError(error.response?.status);
          setErr("케이크 옵션 목록을 불러오지 못했습니다.");
        })
        .finally(() => setLoadingOptions(false));
    },
    [navigate]
  );

  // 최초 로드 시 케이크 목록
  React.useEffect(() => {
    loadCakes();
  }, [loadCakes]);

  // 케이크 선택이 바뀔 때 옵션 목록 로드
  React.useEffect(() => {
    if (selectedCakeId != null) {
      loadOptions(selectedCakeId);
    } else {
      setOptions([]);
    }
  }, [selectedCakeId, loadOptions]);

  const handleLogout = () => {
    setAuthToken(null);
    localStorage.removeItem("adminUsername");
    navigate("/login");
  };

  const handleAddOption = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCakeId == null) {
      setErr("먼저 케이크를 선택해주세요.");
      return;
    }
    if (!newName.trim()) {
      setErr("옵션 이름을 입력해주세요.");
      return;
    }
    const priceNum = parseInt(newPrice, 10);
    if (Number.isNaN(priceNum)) {
      setErr("추가 금액을 숫자로 입력해주세요.");
      return;
    }

    setSaving(true);
    setErr("");

    try {
      await api.post(`/api/cakes/${selectedCakeId}/options`, {
        optionName: newName.trim(),
        price: priceNum,
      });

      await loadOptions(selectedCakeId);
      setNewName("");
      setNewPrice("");
    } catch (error: any) {
      console.error("create option error:", error);
      const status = error.response?.status;
      if (status === 409) {
        setErr("이미 같은 이름의 옵션이 존재하거나 데이터 무결성 위반입니다.");
      } else if (status === 400) {
        setErr("입력값을 다시 확인해주세요.");
      } else {
        setErr("옵션 추가 중 오류가 발생했습니다.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteOption = async (optId: number) => {
    if (!selectedCakeId) return;
    if (!window.confirm("이 옵션을 삭제하시겠습니까?")) return;

    try {
      await api.delete(`/api/cakes/${selectedCakeId}/options/${optId}`);
      await loadOptions(selectedCakeId);
    } catch (error) {
      console.error("delete option error:", error);
      setErr("옵션 삭제 중 오류가 발생했습니다.");
    }
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
          <h1 style={{ fontSize: 20, margin: 0 }}>케이크 옵션 관리</h1>
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

      {/* 케이크 선택 */}
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

      {/* 옵션 목록 + 추가 */}
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
          2. 옵션 목록
        </h2>

        {loadingOptions ? (
          <p style={{ fontSize: 13, color: "#6b7280" }}>옵션 불러오는 중...</p>
        ) : options.length === 0 ? (
          <p style={{ fontSize: 13, color: "#6b7280" }}>
            이 케이크에 등록된 옵션이 없습니다.
          </p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 13,
              marginBottom: 12,
            }}
          >
            <thead>
              <tr>
                <th style={{ textAlign: "left", borderBottom: "1px solid #e5e7eb", padding: 8 }}>
                  ID
                </th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #e5e7eb", padding: 8 }}>
                  옵션 이름
                </th>
                <th style={{ textAlign: "right", borderBottom: "1px solid #e5e7eb", padding: 8 }}>
                  추가 금액
                </th>
                <th style={{ borderBottom: "1px solid #e5e7eb", padding: 8 }}>삭제</th>
              </tr>
            </thead>
            <tbody>
              {options.map((o) => (
                <tr key={o.id}>
                  <td style={{ padding: 8 }}>{o.id}</td>
                  <td style={{ padding: 8 }}>{o.optionName}</td>
                  <td style={{ padding: 8, textAlign: "right" }}>
                    {o.price.toLocaleString()} 원
                  </td>
                  <td style={{ padding: 8, textAlign: "center" }}>
                    <button
                      onClick={() => handleDeleteOption(o.id)}
                      style={{
                        padding: "4px 8px",
                        fontSize: 12,
                        borderRadius: 999,
                        border: "1px solid #fecaca",
                        background: "#fee2e2",
                        cursor: "pointer",
                      }}
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* 옵션 추가 폼 */}
        <form
          onSubmit={handleAddOption}
          style={{ display: "flex", gap: 8, alignItems: "center" }}
        >
          <input
            placeholder="옵션 이름"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            style={{
              flex: 2,
              padding: 8,
              fontSize: 13,
              borderRadius: 8,
              border: "1px solid #d1d5db",
            }}
          />
          <input
            placeholder="추가 금액"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            style={{
              flex: 1,
              padding: 8,
              fontSize: 13,
              borderRadius: 8,
              border: "1px solid #d1d5db",
            }}
          />
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: "8px 12px",
              fontSize: 13,
              borderRadius: 999,
              border: "none",
              background: "#4f46e5",
              color: "white",
              cursor: saving ? "default" : "pointer",
            }}
          >
            {saving ? "추가 중..." : "옵션 추가"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default AdminCakeOptions;
