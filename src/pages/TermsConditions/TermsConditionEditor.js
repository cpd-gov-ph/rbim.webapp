import React, { useState, useEffect } from "react";
import './style.scss';
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import Button from "../../components/Form/Button";
import { postData, getData } from "../../api";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";

const TermsConditionEditor = ({ whichPrivacy, editData, onclose }) => {
  const data = {
    meta_key: '',
    title: "",
    meta_value: '',
  }
  const [commonData, setCommonData] = useState(data);
  const [content, setContent] = useState("");
  const [initLoading, setInitLoading] = useState(false);

  let config = {
    toolbarGroups: [
      {
        name: "editing",
        groups: ["find", "selection", "spellchecker", "editing"]
      },
      { name: "basicstyles", groups: ["basicstyles", "cleanup"] },
      {
        name: "paragraph",
        groups: ["list", "indent", "blocks", "bidi", "paragraph"]
      },
      { name: "cancel", groups: ['undo', 'redo',] },
    ],
    removeButtons:
      "Save,NewPage,Preview,Print,Templates,Cut,Copy,Paste,PasteText,PasteFromWord,Find,SelectAll,Scayt,Replace,Form,Checkbox,Textarea,Select,Button,ImageButton,HiddenField,CreateDiv,BidiLtr,BidiRtl,Language,Flash,Smiley,SpecialChar,PageBreak,Iframe,Anchor,ShowBlocks,About,CopyFormatting",
    fontSize_sizes: "16/16px;24/24px;48/48px;",
    font_names:
      "Arial/Arial, Helvetica, sans-serif;" +
      "Times New Roman/Times New Roman, Times, serif;" +
      "Verdana",
    allowedContent: true,
    disableNativeSpellChecker: false
  };

  const onChange = (evt) => {
    var newContent = evt.editor.getData();

    setContent(newContent);
    if (whichPrivacy === "terms") {
      setCommonData((prev) => ({
        ...prev,
        meta_key: 'term_and_conditions',
        title: "Terms & Conditions",
        meta_value: newContent,
      }));
    } else {
      setCommonData((prev) => ({
        ...prev,
        meta_key: 'privacy_and_policy',
        title: "Privacy & Policy",
        meta_value: newContent,
      }));
    }
  };

  const getTermsSetting = async () => {
    let legalConditions = whichPrivacy === "terms" ? "term_and_conditions" : "privacy_and_policy"
    setInitLoading(true);
    const res = await getData(`view-options/${legalConditions}/`, {});
    if (res.status === 1) {
      setCommonData(res.data);
      setContent(res.data.meta_value);
      setInitLoading(false);
    } else if (res.status === 422) {
      setInitLoading(false);
    } else {
      setInitLoading(false);
    }
  };

  const saveSettingClick = async () => {
    setInitLoading(true);

    const res = await postData("options-update-or-create/", {}, commonData);
    if (res.status === 1) {
      toast.success(res.message, { theme: "colored" });
      setInitLoading(false);
      onclose();
    } else if (res.status === 422) {
      setInitLoading(false);
    } else {
      setInitLoading(false);
      toast.error(res.message, { theme: "colored" });
    }
  };

  useEffect(() => {
    getTermsSetting();
  }, []);


  return (
    <React.Fragment>
      {!initLoading && (
        <React.Fragment>
          <h4 className="tab-content-title">{whichPrivacy === "terms" ? "Terms & Conditions" : "Privacy Policy"}</h4>
          <React.Fragment>
            <CKEditor
              activeClass="p10"
              content={content}
              editor={ClassicEditor}
              config={config}
              data="<p>Hello from the first editor working with the context!</p>"
              events={{
                change: onChange,
              }}
            />
            <div className="text-end mt-3">
              <Button
                type="button"
                onClick={saveSettingClick}
                disabled={initLoading}
                loading={initLoading}
                className="btn-primary text-white"
              >
                Update
              </Button>
            </div>
          </React.Fragment>
        </React.Fragment>
      )}
      {initLoading && <Loader />}
    </React.Fragment>
  );
};

export default TermsConditionEditor;
