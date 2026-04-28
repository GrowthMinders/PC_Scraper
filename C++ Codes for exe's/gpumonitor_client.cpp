#include <windows.h>
#include <pdh.h>
#include <dxgi1_6.h>
#include <iostream>
#include <vector>
#include <map>
#include <string>

#pragma comment(lib, "pdh.lib")
#pragma comment(lib, "dxgi.lib")

struct GpuStats {
    std::string id;
    std::string name;
    double load;
};

std::string WStringToString(std::wstring wstr) {
    if (wstr.empty()) return "";
    int size_needed = WideCharToMultiByte(CP_UTF8, 0, wstr.c_str(), (int)wstr.size(), NULL, 0, NULL, NULL);
    std::string strTo(size_needed, 0);
    WideCharToMultiByte(CP_UTF8, 0, wstr.c_str(), (int)wstr.size(), &strTo[0], size_needed, NULL, NULL);
    return strTo;
}

int main() {
    PDH_HQUERY hQuery;
    PDH_HCOUNTER hCounter;
    std::map<std::string, GpuStats> gpuMap;

    // 1. DISCOVER HARDWARE (Reverse order: External then Internal)
    IDXGIFactory1* pFactory;
    if (SUCCEEDED(CreateDXGIFactory1(__uuidof(IDXGIFactory1), (void**)&pFactory))) {
        IDXGIAdapter1* pAdapter;
        UINT adapterIndex = 0;
        while (pFactory->EnumAdapters1(adapterIndex, &pAdapter) != DXGI_ERROR_NOT_FOUND) {
            DXGI_ADAPTER_DESC1 desc;
            pAdapter->GetDesc1(&desc);
            if (!(desc.Flags & DXGI_ADAPTER_FLAG_SOFTWARE)) {
                std::string id = "phys_" + std::to_string(adapterIndex);
                gpuMap[id] = { id, WStringToString(desc.Description), 0.0 };
            }
            pAdapter->Release();
            adapterIndex++;
        }
        pFactory->Release();
    }

    // 2. FETCH LOAD
    if (PdhOpenQueryW(NULL, 0, &hQuery) == ERROR_SUCCESS) {
        if (PdhAddEnglishCounterW(hQuery, L"\\GPU Engine(*)\\Utilization Percentage", 0, &hCounter) == ERROR_SUCCESS) {
            PdhCollectQueryData(hQuery);
            Sleep(800); 
            PdhCollectQueryData(hQuery);

            DWORD dwSize = 0, dwCount = 0;
            PdhGetFormattedCounterArrayW(hCounter, PDH_FMT_DOUBLE, &dwSize, &dwCount, NULL);
            if (dwSize > 0) {
                std::vector<BYTE> buffer(dwSize);
                PPDH_FMT_COUNTERVALUE_ITEM_W pItems = (PPDH_FMT_COUNTERVALUE_ITEM_W)buffer.data();
                if (PdhGetFormattedCounterArrayW(hCounter, PDH_FMT_DOUBLE, &dwSize, &dwCount, pItems) == ERROR_SUCCESS) {
                    for (DWORD i = 0; i < dwCount; i++) {
                        std::wstring ws(pItems[i].szName);
                        std::string instanceName(ws.begin(), ws.end());
                        size_t pos = instanceName.find("phys_");
                        if (pos != std::string::npos) {
                            std::string id = instanceName.substr(pos, 6);
                            double val = pItems[i].FmtValue.doubleValue;
                            if (gpuMap.count(id) && val > gpuMap[id].load) {
                                gpuMap[id].load = val;
                            }
                        }
                    }
                }
            }
        }
        PdhCloseQuery(hQuery);
    }

    // 3. OUTPUT RAW JSON (External first via rbegin)
    std::cout << "{\"gpus\":[";
    for (auto it = gpuMap.rbegin(); it != gpuMap.rend(); ++it) {
        std::cout << "{"
                  << "\"id\":\"" << it->first << "\","
                  << "\"name\":\"" << it->second.name << "\","
                  << "\"load\":" << it->second.load
                  << "}";
        if (std::next(it) != gpuMap.rend()) std::cout << ",";
    }
    std::cout << "]}" << std::endl;

    return 0;
}
