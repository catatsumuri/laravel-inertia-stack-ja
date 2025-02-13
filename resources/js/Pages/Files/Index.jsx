import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

export default function FileIndex({ files }) {
  const { t } = useLaravelReactI18n();
  const { data, setData, post, errors, processing } = useForm({
    filename: '',
    files: null,
    visibility: 'public',
  });

  // Lightboxの状態管理
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // すべての画像を `slides` として渡す
  const slides = files.map((file) => ({
    src: route('files.show', file.id),
  }));

  const submit = (e) => {
    e.preventDefault();
    post(route('files.store'));
  };

  return (
    <AuthenticatedLayout
      header={<h2 className="text-xl font-semibold leading-tight text-gray-800">{t('Files')}</h2>}
    >
      <Head title="Files" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="bg-white shadow-sm sm:rounded-lg">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800">{t('Upload File')}</h3>

              {/* ファイルアップロードフォーム */}
              <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                  <InputLabel htmlFor="filename" value={t('File Name')} />
                  <TextInput
                    id="filename"
                    type="text"
                    name="filename"
                    value={data.filename}
                    onChange={(e) => setData('filename', e.target.value)}
                    className="mt-1 block w-full"
                  />
                  {errors.filename && <p className="text-sm text-red-500">{errors.filename}</p>}
                </div>

                <div>
                  <InputLabel value={t('Visibility')} />
                  <div className="flex items-center space-x-4 mt-2">
                    {['public', 'private'].map((option) => (
                      <label key={option} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="visibility"
                          value={option}
                          checked={data.visibility === option}
                          onChange={() => setData('visibility', option)}
                          className="mr-2"
                        />
                        {t(option.charAt(0).toUpperCase() + option.slice(1))}
                      </label>
                    ))}
                  </div>
                  {errors.visibility && <p className="text-sm text-red-500">{errors.visibility}</p>}
                </div>

                <div>
                  <input
                    type="file"
                    onChange={(e) => setData('files', e.target.files[0])}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {errors.files && <p className="text-sm text-red-500">{errors.files}</p>}
                </div>

                <PrimaryButton disabled={processing}>{t('Save')}</PrimaryButton>
              </form>
            </div>

            {/* ファイル一覧 */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800">{t('Uploaded Files')}</h3>

              <div className="mt-4">
                {files.length > 0 ? (
                  <div className="overflow-hidden border rounded-lg bg-white shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">{t('ID')}</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">{t('File Name')}</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">{t('Visibility')}</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">{t('Size')}</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">{t('Owner')}</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">{t('Count')}</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">{t('Uploaded At')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {files.map((file, index) => (
                          <tr key={file.id} className="hover:bg-gray-50">
                            {/* ID */}
                            <td className="px-4 py-2 text-sm text-gray-800">{file.id}</td>

                            {/* ファイル名（Lightboxで拡大） */}
                            <td className="px-4 py-2 text-sm font-medium text-gray-800">
                              <div className="flex items-center space-x-2">
                                <img
                                  src={route('files.conversion', { file: file, media: file.mediaId, conversion: 'thumb' })}
                                  alt="Thumbnail"
                                  className="h-10 w-auto rounded cursor-pointer"
                                  onClick={() => {
                                    setCurrentIndex(index);
                                    setIsOpen(true);
                                  }}
                                />
                                <span>{file.name}</span>
                              </div>
                            </td>

                            {/* Visibility (バッジ) */}
                            <td className="px-4 py-2">
                              <span
                                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                  file.visibility === 'public' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'
                                }`}
                              >
                                {t(file.visibility)}
                              </span>
                            </td>

                            {/* ファイルサイズ */}
                            <td className="px-4 py-2 text-sm text-gray-500">{file.filesize}</td>

                            {/* 所有者 */}
                            <td className="px-4 py-2 text-sm text-gray-500">{file.owner}</td>

                            {/* media count */}
                            <td className="px-4 py-2 text-sm text-gray-500">
                              {file.mediaCount}
                              <a href={route('files.zip', file.id)} className="ml-2 px-2 py-1 text-xs font-semibold text-blue-600 border border-blue-600 rounded hover:bg-blue-600 hover:text-white transition">
                                ZIP DL
                              </a>
                            </td>


                            {/* 作成日時 */}
                            <td className="px-4 py-2 text-sm text-gray-500">
                              {new Date(file.created_at).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">{t('No files uploaded yet.')}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox モーダル */}
      {isOpen && (
        <Lightbox
          slides={slides}
          open={isOpen}
          close={() => setIsOpen(false)}
          index={currentIndex}
		  styles={{
			container: { backgroundColor: 'rgba(0, 0, 0, 0.5)' }, // 背景を半透明に
		  }}
        />
      )}
    </AuthenticatedLayout>
  );
}
