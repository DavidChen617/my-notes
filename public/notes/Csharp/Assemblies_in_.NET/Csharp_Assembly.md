# 📘 Assemblies in .NET — 重點摘要筆記

## 🌐 Assemblies 概述
- Assembly 是 .NET 應用程式中**部署、版本控制、重用、啟動範圍與安全權限**的基本單位。  
- Assembly 是由型別（types）與資源（resources）組成的邏輯功能
單元。  
- 格式為：
  - `.exe`（可執行檔）
  - `.dll`（函式庫）
- 為 .NET 應用程式的**基本構件（building blocks）**，並提供 CLR（Common Language Runtime）識別型別實作所需資訊。

---

## 🧩 組件特性（Assembly Properties）
- 實作為 `.exe` 或 `.dll`。
- 在 .NET Framework 中，**可放入 GAC（Global Assembly Cache）** 共用使用。
  - 加入 GAC 需具備 **Strong Name**。
- 僅在**需要時才載入至記憶體** → 節省資源。
- 可使用 **Reflection** 取得組件資訊。
- 可使用 **MetadataLoadContext** 僅載入以供檢查（取代舊的 `Assembly.ReflectionOnlyLoad`）。

---

## ⚙️ Assemblies 與 Common Language Runtime（CLR）
Assembly 定義了 CLR 執行型別所需的所有資訊：

| 邊界類型 | 說明 |
|-----------|------|
| **程式碼邊界** | 每個 Assembly 僅有一個進入點：`Main`, `WinMain`, 或 `DllMain` |
| **安全邊界** | 權限在 Assembly 層級設定與授與 |
| **型別邊界** | 型別名稱包含 Assembly 名稱（同名型別跨 Assembly 不同） |
| **參考範圍邊界** | Assembly Manifest 定義外部依賴與公開資源 |
| **版本邊界** | Assembly 為最小可版本化單位 |
| **部署單位** | 僅需初始呼叫組件在啟動時存在，其餘可延遲載入 |
| **並行執行單位** | 支援同時執行多版本（Side-by-side execution） |

---

## 🏗️ 建立 Assembly（Create an Assembly）
- **靜態組件（Static Assemblies）**  
  - 儲存在磁碟中（PE 檔）  
  - 包含介面、類別與資源（例如圖片、文字檔）  
- **動態組件（Dynamic Assemblies）**  
  - 從記憶體執行，可選擇事後儲存到磁碟  
  - 使用 `System.Reflection.Emit` 建立  

**建立方式：**
- 使用 **Visual Studio** 建立 `.dll` 或 `.exe`
- 使用 **.NET CLI** 或 **Windows SDK 工具**
- 使用 **CLR API** 動態生成  

> 💡 Visual Studio：選單 `Build → Build` 即可產生組件。

---

## 📄 Assembly Manifest（組件資訊清單）
每個 Assembly 都有 **Manifest**，相當於「目錄表」。

**內容包含：**
- Assembly 身分（名稱與版本）
- **檔案表（File Table）**：列出所有組成檔案
- **參考清單（Reference List）**：外部依賴（包含 global 與 private）
  - Global objects：  
    - .NET Core → 與特定 runtime 綁定  
    - .NET Framework → 位於 GAC  
  - Private objects：  
    - 位於應用程式目錄或下層目錄  

> ✅ Manifest 讓應用程式**不依賴外部註冊機制（如 Windows Registry）**，減少 DLL 衝突並簡化部署。

---

## 🔗 新增組件參考（Add a Reference to an Assembly）
- 加入引用後，可直接使用該組件中的命名空間與成員。

### 常見方式：
- **.NET / .NET Core**
  - 使用 **NuGet 套件管理器**
  - 或在 `.csproj` / `.vbproj` 中加入：
    ```xml
    <PackageReference Include="PackageName" Version="x.x.x" />
    ```
- **.NET Framework**
  - Visual Studio → `Add Reference`
  - 或使用命令列參數 `-reference`

> 💡 C# 可透過 `extern alias` 同時使用兩個版本的組件。

---

## 📚 延伸閱讀（Related Content）
| 主題 | 說明 |
|------|------|
| **Assembly contents** | 組件包含的元素 |
| **Assembly manifest** | Manifest 的資料結構與儲存方式 |
| **Global assembly cache** | GAC 的用途與存放位置 |
| **Strong-named assemblies** | 具名組件的特性與用途 |
| **Assembly security considerations** | 組件安全性考量 |
| **Assembly versioning** | 組件版本控制 |
| **Assembly placement** | 組件放置位置策略 |
| **Assemblies and side-by-side execution** | 同時執行多版本組件 |
| **Emit dynamic methods and assemblies** | 建立動態組件與方法 |
| **How the runtime locates assemblies** | CLR 執行階段如何解析組件引用 |

---

## 📘 參考（Reference）
- [`System.Reflection.Assembly`](https://learn.microsoft.com/dotnet/api/system.reflection.assembly)

---
