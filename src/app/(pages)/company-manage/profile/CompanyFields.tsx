import { FormField } from "@/components/manage/FormField";
import type { City, InfoCompany } from "@/types/api";

export const CompanyFields = ({
  infoCompany,
  cities,
}: {
  infoCompany: InfoCompany;
  cities: City[];
}) => (
  <div className="mt-6 grid gap-5 sm:grid-cols-2">
    <div className="sm:col-span-2">
      <FormField
        id="companyName"
        label="Tên công ty"
        defaultValue={infoCompany.companyName}
        required
      />
    </div>
    <FormField
      id="email"
      type="email"
      label="Email"
      defaultValue={infoCompany.email}
      required
    />
    <FormField
      id="phone"
      type="tel"
      label="Số điện thoại"
      defaultValue={infoCompany.phone || ""}
      placeholder="0912345678"
    />
    <FormField id="city" label="Thành phố">
      <select id="city" name="city" defaultValue={infoCompany.city || ""} className="field-select h-11">
        <option value="">Chọn thành phố</option>
        {cities.map((city) => (
          <option key={city._id || city.id} value={city._id || city.id}>
            {city.name}
          </option>
        ))}
      </select>
    </FormField>
    <FormField
      id="address"
      label="Địa chỉ"
      defaultValue={infoCompany.address || ""}
      placeholder="Số 1, Đường ABC, Quận 1"
    />
    <FormField
      id="companyModel"
      label="Mô hình công ty"
      defaultValue={infoCompany.companyModel || ""}
      placeholder="Product, Outsourcing, ..."
    />
    <FormField
      id="companyEmployees"
      label="Quy mô công ty"
      defaultValue={infoCompany.companyEmployees || ""}
      placeholder="50-100 nhân viên"
    />
    <FormField
      id="workingTime"
      label="Thời gian làm việc"
      defaultValue={infoCompany.workingTime || ""}
      placeholder="Thứ 2 - Thứ 6, 8h30 - 17h30"
    />
    <FormField
      id="workOvertime"
      label="Làm việc ngoài giờ"
      defaultValue={infoCompany.workOvertime || ""}
      placeholder="Không yêu cầu OT"
    />
  </div>
);
